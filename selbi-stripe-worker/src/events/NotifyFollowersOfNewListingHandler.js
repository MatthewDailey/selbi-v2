
const NEW_LISTING_EVENT_TYPE = 'new-listing';

function validateNewListingPayload(payload) {
  if (!payload) {
    return Promise.reject('New-Listing event must have payload');
  }
  if (!payload.listingId) {
    return Promise.reject('New-Listing event payload does not include listingId');
  }
  return Promise.resolve();
}

export default class NotifyFollowersOfNewListingHandler {
  accept(data) {
    return data.type === NEW_LISTING_EVENT_TYPE;
  }

  handle(data, firebaseDb, sendNotification) {
    const bulletin = {
      type: 'friend-posted-new-listing',
      status: 'unread',
      timestamp: data.timestamp,
      payload: {
        sellerId: data.owner,
      },
    };

    const setBulletinListingId = () => {
      bulletin.payload.listingId = data.payload.listingId;
      return Promise.resolve();
    };

    const loadFollowers = () => firebaseDb
      .ref('followers')
      .child(data.owner)
      .once('value')
      .then((followersSnapshot) => {
        if (followersSnapshot.exists()) {
          return followersSnapshot.val();
        }
        return {};
      });

    const addSellerPublicDataToBulletin = () => firebaseDb
      .ref('userPublicData')
      .child(data.owner)
      .once('value')
      .then((ownerPublicDataSnapshot) => {
        if (ownerPublicDataSnapshot.exists()) {
          return ownerPublicDataSnapshot.val();
        }
        return Promise.reject(`Unable to load public data for new follower ${data.owner}`);
      })
      .then((newFollowerPublicData) => {
        bulletin.payload.sellerPublicData = newFollowerPublicData;
      });

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

    const notifyFollower = (followerUid) => {
      const sendBullitenPromise = firebaseDb
        .ref('userBulletins')
        .child(followerUid)
        .push()
        .set(bulletin);

      const sendNotificationPromise = loadUserPrivateInfo(followerUid)
        .then((userData) => sendNotification(
          userData.fcmToken,
          `${bulletin.payload.sellerPublicData.displayName} just posted a new listing!`,
          `${bulletin.payload.sellerPublicData.displayName} just posted a new listing!`));

      return Promise.all([sendBullitenPromise, sendNotificationPromise]);
    };

    return validateNewListingPayload(data.payload)
      .then(setBulletinListingId)
      .then(addSellerPublicDataToBulletin)
      .then(loadFollowers)
      .then((followers) => {
        const allFollowerPromises = [];
        Object.keys(followers).forEach((followerUid) => {
          if (followers[followerUid]) {
            allFollowerPromises.push(notifyFollower(followerUid));
          }
        });
        return Promise.all(allFollowerPromises);
      });
  }
}

