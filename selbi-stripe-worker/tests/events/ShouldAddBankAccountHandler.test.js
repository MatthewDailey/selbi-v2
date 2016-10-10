import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

import FirebaseTest, { testUserUid, minimalUserUid, deepCopy }
  from '@selbi/firebase-test-resource';

import ShouldAddBankAccountHandler from '../../src/events/ShouldAddBankAccountHandler';

chai.use(dirtyChai);

const handler = new ShouldAddBankAccountHandler();

const validNewListingEvent = {
  type: 'new-listing',
  timestamp: 1,
  owner: minimalUserUid,
  payload: {
    listingId: 'test-listing',
  },
};

describe('events - ShouldAddBankAccountHandler', () => {
  it('accepts \'new-listing\' events', () => {
    expect(handler.accept({ type: 'new-listing' })).to.be.true();
  });

  it('does not accept generic type', () => {
    expect(handler.accept({ type: 'arbitrary' })).to.be.false();
  });

  it('fails without valid payload', (done) => {
    const invalidFollowEvent = deepCopy(validNewListingEvent);
    delete invalidFollowEvent.payload;

    handler.handle(invalidFollowEvent, FirebaseTest.serviceAccountApp.database())
      .then(() => {
        throw new Error('Should not be able to store invalid follow event');
      })
      .catch((error) => {
        if (!error.includes('New-Listing event')) {
          throw error;
        }
      })
      .then(done)
      .catch(done);
  });

  describe('sucessful store with no bank account', () => {
    before(function (done) {
      this.timeout(6000);

      FirebaseTest
        .createMinimalUser()
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
      handler.handle(
        validNewListingEvent,
        FirebaseTest.serviceAccountApp.database())
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
          expect(userBulletins[userBulletinKeys[0]].type).to.equal('should-add-bank-account');
        })
        .then(done)
        .catch(done);
    });
  });

  describe('no store with bank account', () => {
    before(function (done) {
      this.timeout(6000);

      FirebaseTest
        .createMinimalUser()
        .then(() => FirebaseTest
          .serviceAccountApp
          .database()
          .ref('users')
          .child(minimalUserUid)
          .child('merchant')
          .set({
            status: 'OK',
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
      handler.handle(
        validNewListingEvent,
        FirebaseTest.serviceAccountApp.database())
        .then(() => FirebaseTest
          .minimalUserApp
          .database()
          .ref('userBulletins')
          .child(minimalUserUid)
          .once('value'))
        .then((userBulletinsSnapshot) => {
          expect(userBulletinsSnapshot.exists()).to.be.false();
          return userBulletinsSnapshot.val();
        })
        .then(done)
        .catch(done);
    });
  });
});


