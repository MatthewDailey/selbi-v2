import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

import FirebaseTest, { minimalUserUid }
  from '@selbi/firebase-test-resource';

import ClearShouldAddBankAccountHandler from '../../src/events/ClearShouldAddBankAccountHandler';

chai.use(dirtyChai);

const handler = new ClearShouldAddBankAccountHandler();

const validAddedBankEvent = {
  type: 'added-bank',
  timestamp: 1,
  owner: minimalUserUid,
  payload: {},
};

describe('events - ClearShouldAddBankAccountHandler', () => {
  it('accepts \'added-bank\' events', () => {
    expect(handler.accept({ type: 'added-bank' })).to.be.true();
  });

  it('does not accept generic type', () => {
    expect(handler.accept({ type: 'arbitrary' })).to.be.false();
  });

  describe('sucessfully mark bulletin as read', () => {
    before(function (done) {
      this.timeout(6000);

      FirebaseTest
        .createMinimalUser()
        .then(() => FirebaseTest
          .serviceAccountApp
          .database()
          .ref('userBulletins')
          .remove())
        .then(() => FirebaseTest
          .serviceAccountApp
          .database()
          .ref('userBulletins')
          .child(minimalUserUid)
          .push()
          .set({
            type: 'should-add-bank-account',
            timestamp: 1,
            status: 'unread',
          }))
        .then(done)
        .catch(done);
    });

    it('can update', (done) => {
      handler.handle(
        validAddedBankEvent,
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
          expect(userBulletins[userBulletinKeys[0]].status).to.equal('read');
        })
        .then(done)
        .catch(done);
    });
  });
});


