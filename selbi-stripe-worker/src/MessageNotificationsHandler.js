
function validateData(data) {
  return Promise.resolve();
}

function addOrUpdateMessagesBulletin(firebaseDb,
                                     recipientUid,
                                     buyerUid,
                                     listingId,
                                     listingTitle,
                                     senderDisplayName) {
  const bulletin = {
    type: 'new-message',
    timestamp: new Date().getTime(),
    status: 'unread',
    payload: {
      count: 1,
      chat: {
        buyerUid,
        listingId,
      },
      listingTitle,
      senderDisplayName,
    },
  };
  const newBulletinRef = firebaseDb.ref('userBulletins')
    .child(recipientUid)
    .push();

  return firebaseDb.ref('userBulletins')
    .child(recipientUid)
    .transaction((currentBulletins) => {
      let foundUnreadMessageFromSameSender = false;

      const newBulletins = Object.assign({}, currentBulletins);

      if (currentBulletins) {
        Object.keys(currentBulletins).forEach((key) => {
          if (currentBulletins[key].type === 'new-message'
            && currentBulletins[key].status === 'unread'
            && currentBulletins[key].payload.chat.buyerUid === buyerUid
            && currentBulletins[key].payload.chat.listingId === listingId) {
            foundUnreadMessageFromSameSender = true;
            newBulletins[key].payload.count += 1;
            newBulletins[key].timestamp = new Date().getTime();
          }
        });
      }

      if (!foundUnreadMessageFromSameSender) {
        newBulletins[newBulletinRef.key] = bulletin;
      }

      return newBulletins;
    });
}

export default class MessageNotificationsHandler {
  constructor(firebaseDb, sendNotification) {
    this.firebaseDb = firebaseDb;
    this.sendNotification = sendNotification;
  }

  getTaskHandler() {
    const firebaseDb = this.firebaseDb;
    const sendNotification = this.sendNotification;

    const loadUserPublicInfo = (uid) => {
      return firebaseDb
        .ref('userPublicData')
        .child(uid)
        .once('value')
        .then((userSnapshot) => {
          if (!userSnapshot.exists()) {
            return Promise.reject(
              `Could not find user public info /userPublicData/${uid}`);
          }
          return Promise.resolve(userSnapshot.val());
        });
    };

    const loadUserPrivateInfo = (uid) => {
      return firebaseDb
        .ref('users')
        .child(uid)
        .once('value')
        .then((userSnapshot) => {
          if (!userSnapshot.exists()) {
            return Promise.reject(
              `Could not find user /users/${uid}`);
          }
          return Promise.resolve(userSnapshot.val());
        });
    };

    const checkIfRecipientBlockedSender = (recipientUid, authorUid) => {
      return firebaseDb
        .ref('blocking')
        .child(recipientUid)
        .child(authorUid)
        .once('value')
        .then((snapshot) => {
          if (snapshot.exists() && snapshot.val()) {
            return Promise.reject(`User ${recipientUid} blocked message from ${authorUid}`);
          }
          return Promise.resolve();
        });
    };

    return (data, progress, resolveTask, rejectTask) => {
      const listingId = data.listingId;
      const buyerId = data.buyerId;
      const messageId = data.messageId;

      console.log(`Handling messageNotification ${listingId} : ${buyerId} : ${messageId}`);

      const loadNotificationData = () => {
        const promiseLoadMessage = firebaseDb
          .ref('messages')
          .child(listingId)
          .child(buyerId)
          .child(messageId)
          .once('value')
          .then((messageSnapshot) => {
            if (!messageSnapshot.exists()) {
              return Promise.reject(
                `Could not find message /messages/${listingId}/${buyerId}/${messageId}`);
            }
            return Promise.resolve(messageSnapshot.val());
          });

        const promiseLoadListing = firebaseDb
          .ref('listings')
          .child(listingId)
          .once('value')
          .then((listingSnapshot) => {
            if (!listingSnapshot.exists()) {
              return Promise.reject(`Could not find listing /listings/${listingId}`);
            }
            return Promise.resolve(listingSnapshot.val());
          });

        return Promise.all([promiseLoadMessage, promiseLoadListing])
          .then((messageAndListing) => {
            const message = messageAndListing[0];
            const listing = messageAndListing[1];
            const sellerId = listing.sellerId;

            const getRecipient = (messageAuthorId) => {
              if (messageAuthorId === buyerId) {
                return sellerId;
              }
              return buyerId;
            };

            const promiseAuthorName = loadUserPublicInfo(message.authorUid)
              .then((authorPublicInfo) => authorPublicInfo.displayName);

            const recipientId = getRecipient(message.authorUid);
            const promiseRecipientFcmToken = loadUserPrivateInfo(recipientId)
              .then((recipient) => Promise.resolve(recipient.fcmToken));

            const promiseRecipientId = Promise.resolve(recipientId);
            const promiseMessage = Promise.resolve(message.text);
            const promiseListingTitle = Promise.resolve(listing.title);

            return checkIfRecipientBlockedSender(recipientId, message.authorUid)
              .then(() => Promise.all([promiseRecipientFcmToken, promiseAuthorName, promiseMessage,
              promiseListingTitle, promiseRecipientId]));
          });
      };

      return validateData(data)
        .then(loadNotificationData)
        .then((fcmTokenAndAuthorAndMessageAndListingTitle) => {
          const recipientId = fcmTokenAndAuthorAndMessageAndListingTitle[4];
          const authorName = fcmTokenAndAuthorAndMessageAndListingTitle[1];
          const listingTitle = fcmTokenAndAuthorAndMessageAndListingTitle[3];

          return addOrUpdateMessagesBulletin(
              firebaseDb,
              recipientId,
              buyerId,
              listingId,
              listingTitle,
              authorName)
            .then(() => fcmTokenAndAuthorAndMessageAndListingTitle);
        })
        .then((fcmTokenAndAuthorAndMessageAndListingTitle) => {
          const fcmToken = fcmTokenAndAuthorAndMessageAndListingTitle[0];
          const authorName = fcmTokenAndAuthorAndMessageAndListingTitle[1];
          const messageText = fcmTokenAndAuthorAndMessageAndListingTitle[2];
          const listingTitle = fcmTokenAndAuthorAndMessageAndListingTitle[3];
          const recipientId = fcmTokenAndAuthorAndMessageAndListingTitle[4];

          if (!fcmToken) {
            return Promise.reject(`Unable to find fcmToken for user ${recipientId}`);
          }

          return sendNotification(
            fcmToken,
            `New Message about ${listingTitle}`,
            `${authorName}: ${messageText}`);
        })
        .then(() => resolveTask())
        .catch((error) => {
          console.log(error);
          rejectTask(error);
        });
    };
  }
}
