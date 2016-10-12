import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { spy } from 'sinon';

import FirebaseTest, { testUserUid }
  from '@selbi/firebase-test-resource';

import VerifyPhoneHandler from '../../src/sms/VerifyPhoneHandler';

chai.use(dirtyChai);

const handler = new VerifyPhoneHandler();

const verifyPhoneEvent = {
  type: 'verify-phone',
  timestamp: 1,
  owner: testUserUid,
  payload: {
    phoneNumber: '+12064379006',
    code: '1234',
  },
};

const firebaseDb = FirebaseTest.serviceAccountApp.database();

describe('VerifyPhoneHandler', () => {
  beforeEach(function (done) {
    this.timeout(6000);
    firebaseDb
      .ref('phoneVerification')
      .child(verifyPhoneEvent.payload.phoneNumber)
      .remove()
      .then(() => firebaseDb
        .ref('phoneToUser')
        .child(verifyPhoneEvent.payload.phoneNumber)
        .remove())
      .then(done)
      .catch(done);
  });

  it('accepts add-phone', () => {
    expect(handler.accept(verifyPhoneEvent)).to.be.true();
  });

  it('accepts add-phone', () => {
    expect(handler.accept({ type: 'unknown' })).to.be.false();
  });

  it('sets error if no verification code', (done) => {
    handler.handle(verifyPhoneEvent, firebaseDb)
      .then(() => firebaseDb
        .ref('phoneToUser')
        .child(verifyPhoneEvent.payload.phoneNumber)
        .once('value'))
      .then((phoneToUserSnapshot) => {
        expect(phoneToUserSnapshot.exists(), 'No phone to user data.').to.be.true();
        expect(phoneToUserSnapshot.val(), 'Phone to should have errored').not.to.equal(testUserUid);
      })
      .then(done)
      .catch(done);
  });

  it('sets error if verification code does not match', (done) => {
    firebaseDb
      .ref('phoneVerification')
      .child(verifyPhoneEvent.payload.phoneNumber)
      .set('non-matching-code')
      .then(() => handler.handle(verifyPhoneEvent, firebaseDb))
      .then(() => firebaseDb
        .ref('phoneToUser')
        .child(verifyPhoneEvent.payload.phoneNumber)
        .once('value'))
      .then((phoneToUserSnapshot) => {
        expect(phoneToUserSnapshot.exists(), 'No phone to user data.').to.be.true();
        expect(phoneToUserSnapshot.val(), 'Phone to should have errored').not.to.equal(testUserUid);
      })
      .then(done)
      .catch(done);
  });

  it('sets user if no verification code', (done) => {
    firebaseDb
      .ref('phoneVerification')
      .child(verifyPhoneEvent.payload.phoneNumber)
      .set(verifyPhoneEvent.payload.code)
      .then(() => handler.handle(verifyPhoneEvent, firebaseDb))
      .then(() => firebaseDb
        .ref('phoneToUser')
        .child(verifyPhoneEvent.payload.phoneNumber)
        .once('value'))
      .then((phoneToUserSnapshot) => {
        expect(phoneToUserSnapshot.exists(), 'No phone to user data.').to.be.true();
        expect(phoneToUserSnapshot.val(), 'Phone to should have set uid').to.equal(testUserUid);
      })
      .then(done)
      .catch(done);
  });
});
