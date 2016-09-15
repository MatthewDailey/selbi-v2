
function validateData(data) {
  return Promise.resolve();
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

    return (data, progress, resolveTask, rejectTask) => {
      const listingId = data.listingId;
      const buyerId = data.buyerId;
      const messageId = data.messageId;

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
            const sellerId = listing.sellerUid;

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
              .then((recipient) => {
                if (recipient.fcmToken) {
                  return Promise.resolve(recipient.fcmToken);
                }
                return Promise.reject(`Unable to find fcmToken for user ${recipientId}`);
              });

            const promiseMessage = Promise.resolve(message.text);
            const promiseListingTitle = Promise.resolve(listing.title);

            return Promise.all([promiseRecipientFcmToken, promiseAuthorName, promiseMessage,
              promiseListingTitle]);
          });
      };

      return validateData(data)
        .then(loadNotificationData)
        .then((fcmTokenAndAuthorAndMessageAndListingTitle) => {
          const fcmToken = fcmTokenAndAuthorAndMessageAndListingTitle[0];
          const authorName = fcmTokenAndAuthorAndMessageAndListingTitle[1];
          const messageText = fcmTokenAndAuthorAndMessageAndListingTitle[2];
          const listingTitle = fcmTokenAndAuthorAndMessageAndListingTitle[3];
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
