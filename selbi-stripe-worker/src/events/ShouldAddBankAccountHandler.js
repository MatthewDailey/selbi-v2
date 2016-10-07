
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

  handle(data, firebaseDb) {
    const bulletin = {
      type: 'should-add-bank-account',
      status: 'unread',
      timestamp: data.timestamp,
      payload: {},
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

    const notifyIfNoBankAccount = (userPrivateData) => {
      if (!userPrivateData.merchant || userPrivateData.merchant.status !== 'OK') {
        return firebaseDb
          .ref('userBulletins')
          .child(data.owner)
          .push()
          .set(bulletin);
      }
      return Promise.resolve();
    };

    return validateNewListingPayload(data.payload)
      .then(() => loadUserPrivateInfo(data.owner))
      .then(notifyIfNoBankAccount);
  }
}

