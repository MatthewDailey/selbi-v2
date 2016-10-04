import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import FirebaseTest, { testUserUid, expectUnableToStore, deepCopy }
  from '@selbi/firebase-test-resource';

chai.use(dirtyChai);

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

  it('can load by timestamp order', (done) => {
    let childCount = 0;

    // Expect earliest first.
    const checkTimestamps = (bulletinSnapshot) => {
      expect(bulletinSnapshot.exists()).to.be.true();

      if (childCount === 0) {
        expect(bulletinSnapshot.val().timestamp).to.equal(firstUserBulletin.timestamp);
      }

      if (childCount === 1) {
        expect(bulletinSnapshot.val().timestamp).to.equal(readUserBulletin.timestamp);
      }

      if (childCount === 2) {
        expect(bulletinSnapshot.val().timestamp).to.equal(userBulletinWithPayload.timestamp);
      }

      childCount++;

      if (childCount > 2) {
        FirebaseTest.testUserApp.database()
          .ref('userBulletins')
          .child(testUserUid)
          .orderByChild('timestamp')
          .limitToFirst(3)
          .off('child_added', checkTimestamps)
        done();
      }
    };

    const checkBulletins = () => FirebaseTest.testUserApp.database()
      .ref('userBulletins')
      .child(testUserUid)
      .orderByChild('timestamp')
      .limitToFirst(3)
      .on('child_added', checkTimestamps);

    pushTestUserBulletin(readUserBulletin)
      .then(() => pushTestUserBulletin(userBulletinWithPayload))
      .then(() => pushTestUserBulletin(firstUserBulletin))
      .then(checkBulletins)
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

