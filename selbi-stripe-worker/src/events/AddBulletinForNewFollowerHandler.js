
const FOLLOW_EVENT_TYPE = 'follow';

function validateFollowPayload(payload) {
  if (!payload) {
    return Promise.reject('Follow event must have payload');
  }
  if (!payload.leader) {
    return Promise.reject('Follow event payload does not include leader');
  }
  return Promise.resolve();
}

export default class AddBulletinForNewFollower {
  accept(data) {
    return data.type === FOLLOW_EVENT_TYPE;
  }

  handle(data, firebaseDb, sendNotification) {
    const bulletin = {
      type: FOLLOW_EVENT_TYPE,
      status: 'unread',
      timestamp: data.timestamp,
      payload: {
        newFollowerUid: data.owner,
      },
    };

    const checkIfAlreadyFollowing = () => {
      return firebaseDb
        .ref('following')
        .child(data.payload.leader)
        .child(data.owner)
        .once('value')
        .then((isLeaderAlreadyFollowingNewFollowerSnapshot) => {
          bulletin.payload.reciprocated = isLeaderAlreadyFollowingNewFollowerSnapshot.exists()
            && isLeaderAlreadyFollowingNewFollowerSnapshot.val();
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

    const sendNotificationToLeader = () =>
      loadUserPrivateInfo(data.payload.leader)
        .then((userData) => sendNotification(
          userData.fcmToken,
          'You have a new follower!',
          `${bulletin.payload.newFollowerPublicData.displayName} just followed you.`));

    return validateFollowPayload(data.payload)
      .then(() => firebaseDb
        .ref('userPublicData')
        .child(data.owner)
        .once('value'))
      .then((ownerPublicDataSnapshot) => {
        if (ownerPublicDataSnapshot.exists()) {
          return ownerPublicDataSnapshot.val();
        }
        return Promise.reject(`Unable to load public data for new follower ${data.owner}`);
      })
      .then((newFollowerPublicData) => {
        bulletin.payload.newFollowerPublicData = newFollowerPublicData;
      })
      .then(checkIfAlreadyFollowing)
      .then(() => firebaseDb
        .ref('userBulletins')
        .child(data.payload.leader)
        .push()
        .set(bulletin))
      .then(sendNotificationToLeader);

  }
}

