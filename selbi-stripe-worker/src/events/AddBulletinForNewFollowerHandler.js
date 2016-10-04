
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

  handle(data, firebaseDb) {
    const bulletin = {
      type: FOLLOW_EVENT_TYPE,
      status: 'unread',
      timestamp: data.timestamp,
      payload: {
        newFollowerUid: data.owner,
      },
    };

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
      .then(() => firebaseDb
        .ref('userBulletins')
        .child(data.payload.leader)
        .push()
        .set(bulletin));
  }
}

