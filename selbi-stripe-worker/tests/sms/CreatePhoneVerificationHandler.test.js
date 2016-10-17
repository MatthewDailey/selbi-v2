import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { spy } from 'sinon';

import FirebaseTest, { testUserUid }
  from '@selbi/firebase-test-resource';

import CreatePhoneVerificationHandler from '../../src/sms/CreatePhoneVerificationHandler';

chai.use(dirtyChai);

const handler = new CreatePhoneVerificationHandler();

const addPhoneEvent = {
  type: 'add-phone',
  timestamp: 1,
  owner: testUserUid,
  payload: {
    phoneNumber: '+12064379006',
  },
};

describe('CreatePhoneVerificationHandler', () => {
  before((done) => {
    FirebaseTest
      .serviceAccountApp
      .database()
      .ref('phoneVerification')
      .child(addPhoneEvent.payload.phoneNumber)
      .remove()
      .then(done)
      .catch(done);
  });

  it('accepts add-phone', () => {
    expect(handler.accept(addPhoneEvent)).to.be.true();
  });

  it('accepts add-phone', () => {
    expect(handler.accept({ type: 'unknown' })).to.be.false();
  });

  it('creates code and sends sms', (done) => {
    const sendSmsSpy = spy();
    const sendNotificationSpy = spy();

    const firebaseDb = FirebaseTest.serviceAccountApp.database();

    handler.handle(addPhoneEvent,
      firebaseDb,
      sendNotificationSpy,
      sendSmsSpy)
      .then(() => firebaseDb
        .ref('phoneVerification')
        .child(addPhoneEvent.payload.phoneNumber)
        .once('value'))
      .then((phoneVerificationSnapshot) => {
        expect(phoneVerificationSnapshot.exists(), 'Phone verification not created').to.be.true();
      })
      .then(() => {
        expect(sendSmsSpy.calledWith(addPhoneEvent.payload.phoneNumber), 'SMS not sent')
          .to.be.true();
        expect(sendNotificationSpy.called, 'Notification sent').to.be.false();
      })
      .then(done)
      .catch(done);
  });
});
