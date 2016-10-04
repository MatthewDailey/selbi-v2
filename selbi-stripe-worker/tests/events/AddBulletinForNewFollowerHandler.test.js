import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

import FirebaseTest, { testUserUid, minimalUserUid, deepCopy }
  from '@selbi/firebase-test-resource';

import AddBulletinForNewFollowerHandler from '../../src/events/AddBulletinForNewFollowerHandler';

chai.use(dirtyChai);

const handler = new AddBulletinForNewFollowerHandler();

const validFollowEvent = {
  type: 'follow',
  timestamp: 1,
  owner: testUserUid,
  payload: {
    leader: minimalUserUid,
  },
};

describe('events - AddBulletinForNewFollowerHandler', () => {
  it('accepts \'follow\' events', () => {
    expect(handler.accept({ type: 'follow' })).to.be.true();
  });

  it('does not accept generic type', () => {
    expect(handler.accept({ type: 'arbitrary' })).to.be.false();
  });

  it('fails without newFollower public data', (done) => {
    handler.handle(validFollowEvent, FirebaseTest.serviceAccountApp.database())
      .then(() => {
        throw new Error('Should not be able to store invalid follow event');
      })
      .catch((error) => {
        if (!error.includes('Unable to load public data')) {
          throw error;
        }
      })
      .then(done)
      .catch(done);
  });

  it('fails without valid payload', (done) => {
    const invalidFollowEvent = deepCopy(validFollowEvent);
    delete invalidFollowEvent.payload;

    handler.handle(invalidFollowEvent, FirebaseTest.serviceAccountApp.database())
      .then(() => {
        throw new Error('Should not be able to store invalid follow event');
      })
      .catch((error) => {
        if (!error.includes('Follow event')) {
          throw error;
        }
      })
      .then(done)
      .catch(done);
  });

  describe('sucessful store', () => {
    before(function (done) {
      this.timeout(6000);

      FirebaseTest.createMinimalUser()
        .then(() => FirebaseTest
          .testUserApp
          .database()
          .ref('userPublicData')
          .child(testUserUid)
          .set({
            username: 'testuser',
            displayName: 'Test User',
          }))
        .then(() => FirebaseTest
          .serviceAccountApp
          .database()
          .ref('userBulletins')
          .remove())
        .then(done)
        .catch(done);
    });

    after((done) => {
      FirebaseTest
        .serviceAccountApp
        .database()
        .ref('userPublicData')
        .remove()
        .then(done)
        .catch(done);
    });

    it('can handle valid input', (done) => {
      handler.handle(validFollowEvent, FirebaseTest.serviceAccountApp.database())
        .then(() => FirebaseTest
          .minimalUserApp
          .database()
          .ref('userBulletins')
          .child(minimalUserUid)
          .once('value'))
        .then((userBulletinsSnapshot) => {
          expect(userBulletinsSnapshot.exists()).to.be.true();
          return userBulletinsSnapshot.val();
        })
        .then((userBulletins) => {
          const userBulletinKeys = Object.keys(userBulletins);
          expect(userBulletinKeys.length).to.equal(1);

          expect(userBulletins[userBulletinKeys[0]].payload.newFollowerPublicData.username)
            .to.equal('testuser');
        })
        .then(done)
        .catch(done);
    });
  });
});


