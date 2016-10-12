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
  before((done) => {
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

  it('verifies code and sets phoneToUser', (done) => {
    // TODO
    done();
  });
});
