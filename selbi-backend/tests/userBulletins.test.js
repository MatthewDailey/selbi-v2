import { expect } from 'chai';
import FirebaseTest, { testUserUid, expectUnableToStore, deepCopy }
  from '@selbi/firebase-test-resource';

const firstUserBulletin = {
  timestamp: 1,
  type: 'new-follower',
  status: 'unread',
};

const readUserBulletin = {
  timestamp: 2,
  type: 'new-follower',
  status: 'read',
};

const userBulletinWithPayload = {
  timestamp: 3,
  type: 'new-message',
  status: 'unread',
  payload: {
    fromName: 'jamal',
    listingTitle: 'Cool Item',
    listingId: 'test-listing-id',
  },
};

function pushTestUserBulletin(bulletin) {
  return FirebaseTest.testUserApp.database()
    .ref('userBulletins')
    .child(testUserUid)
    .push()
    .set(bulletin);
}

describe('/userBulletins', () => {
  beforeEach(function (done) {
    this.timeout(6000);
    FirebaseTest
      .serviceAccountApp
      .database()
      .ref('/userBulletins')
      .remove()
      .then(done);
  });

  it('can publish unread, no payload', (done) => {
    pushTestUserBulletin(firstUserBulletin)
      .then(done)
      .catch(done);
  });

  it('can publish read, no payload', (done) => {
    pushTestUserBulletin(readUserBulletin)
      .then(done)
      .catch(done);
  });

  it('can publish with payload', (done) => {
    pushTestUserBulletin(userBulletinWithPayload)
      .then(done)
      .catch(done);
  });

  describe('missing fields', () => {
    it('timestamp', (done) => {
      const bulletinWithoutTimestamp = deepCopy(firstUserBulletin);
      delete bulletinWithoutTimestamp.timestamp;

      expectUnableToStore(
        pushTestUserBulletin(bulletinWithoutTimestamp))
        .then(done)
        .catch(done);
    });

    it('type', (done) => {
      const bulletinWithoutType = deepCopy(firstUserBulletin);
      delete bulletinWithoutType.type;

      expectUnableToStore(
        pushTestUserBulletin(bulletinWithoutType))
        .then(done)
        .catch(done);
    });

    it('status', (done) => {
      const bulletinWithoutStatus = deepCopy(firstUserBulletin);
      delete bulletinWithoutStatus.status;

      expectUnableToStore(
        pushTestUserBulletin(bulletinWithoutStatus))
        .then(done)
        .catch(done);
    });

    it('invalid status', (done) => {
      const bulletinWithInvalidStatus = deepCopy(firstUserBulletin);
      bulletinWithInvalidStatus.status = 'jibberish';

      expectUnableToStore(
        pushTestUserBulletin(bulletinWithInvalidStatus))
        .then(done)
        .catch(done);
    });
  });
});

