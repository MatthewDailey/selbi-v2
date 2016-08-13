import { expect } from 'chai';
import Queue from 'firebase-queue';
import FirebaseTest, { testUserUid } from './FirebaseTestConnections';

function testSafeWorker(worker, done) {
  return (data, progress, resolve, reject) => {
    try {
      worker(data);
      resolve();
      done();
    } catch (e) {
      reject(e);
      done(e);
    }
  };
}

describe('Create Account', () => {
  beforeEach((done) => {
    FirebaseTest
      .serviceAccountApp
      .database()
      .ref('/createAccount')
      .remove()
      .then(done);
  });

  function writeToQueueAndExpectHandled(firebaseUserApp, testData, done) {
    new Queue(
      FirebaseTest.serviceAccountApp.database().ref('/createAccount'),
      testSafeWorker(
        (data) => {
          expect(data.foo).to.equal(testData.foo);
        },
        done));

    firebaseUserApp
      .database()
      .ref('/createAccount/tasks')
      .child('testData')
      .set(testData);
  }

  it('can create queue and handle work as service worker', (done) => {
    const testData = {
      foo: 'bar',
    };
    writeToQueueAndExpectHandled(FirebaseTest.serviceAccountApp, testData, done);
  });

  it('can create queue and handle work as  worker', (done) => {
    const testData = {
      payload: {
        external_account: 'stripeConnectBankToken',
        email: 'user@selbi.io',
        // managed: true,
        // country: 'US',
        legal_entity: {
          dob: {
            day: 20,
            month: 3,
            year: 1990,
          },
          first_name: 'test',
          last_name: 'user',
          // type: 'individual', // only other option is 'company'
          address: {
            line1: '655 Natoma Street',
            line2: 'Apt C',
            city: 'San Francisco',
            postal_code: '94103',
            state: 'CA',
          },
          personal_id_number: 'stripeSsnToken',
        },
        tos_acceptance: {
          date: Date.now() / 1000,
          ip: '12.23.34.45',
        },
      },
      uid: testUserUid,
    };
    writeToQueueAndExpectHandled(FirebaseTest.testUserApp, testData, done);
  });

  function writeAndExpectFailure(firebaseActionOnCreateAccountRef, done) {
    firebaseActionOnCreateAccountRef(FirebaseTest
      .testUserApp
      .database()
      .ref('createAccount'))
      .then(() => {
        done(new Error('Should not be able to store'));
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
        done();
      });
  }

  it('cannot write directly to /createAccount as user', (done) => {
    writeAndExpectFailure((createAccountRef) => createAccountRef.push({ foo: 'bar' }), done);
  });

  it('cannot write to /createAccount/specs as user', (done) => {
    writeAndExpectFailure(
      (createAccountRef) => createAccountRef.child('specs').push({ foo: 'bar' }), done);
  });

  it('cannot write to /createAccount/tasks with bad data', (done) => {
    writeAndExpectFailure(
      (createAccountRef) => createAccountRef.child('tasks').push({ foo: 'bar' }), done);
  });

  it('cannot write to /createAccount/tasks with different uid from auth.uid', (done) => {
    writeAndExpectFailure(
      (createAccountRef) => createAccountRef.child('tasks').push({
        payload: {
          external_account: 'stripeConnectBankToken',
          email: 'user@selbi.io',
          // managed: true,
          // country: 'US',
          legal_entity: {
            dob: {
              day: 20,
              month: 3,
              year: 1990,
            },
            first_name: 'test',
            last_name: 'user',
            // type: 'individual', // only other option is 'company'
            address: {
              line1: '655 Natoma Street',
              line2: 'Apt C',
              city: 'San Francisco',
              postal_code: '94103',
              state: 'CA',
            },
            personal_id_number: 'stripeSsnToken',
          },
          tos_acceptance: {
            date: Date.now() / 1000,
            ip: '12.23.34.45',
          },
        },
        uid: 'not a user',
      }), done);
  });

  it('cannot write to /createAccount/tasks with empty payload', (done) => {
    writeAndExpectFailure(
      (createAccountRef) => createAccountRef.child('tasks').push({
        payload: {},
        uid: testUserUid,
      }), done);
  });

  function testPayloadPropertyAsValueAndAbsentFails(payloadModification, payloadDeletion, done) {
    const taskData = {
      payload: {
        external_account: 1,
        email: 'user@selbi.io',
        // managed: true,
        // country: 'US',
        legal_entity: {
          dob: {
            day: 20,
            month: 3,
            year: 1990,
          },
          first_name: 'test',
          last_name: 'user',
          // type: 'individual', // only other option is 'company'
          address: {
            line1: '655 Natoma Street',
            line2: 'Apt C',
            city: 'San Francisco',
            postal_code: '94103',
            state: 'CA',
          },
          personal_id_number: 'stripeSsnToken',
        },
        tos_acceptance: {
          date: Date.now() / 1000,
          ip: '12.23.34.45',
        },
      },
      uid: testUserUid,
    };

    payloadModification(taskData.payload);

    FirebaseTest
      .testUserApp
      .database()
      .ref('createAccount/tasks')
      .push(taskData)
      .then(() => {
        console.log(taskData);
        done(new Error('Should not be able to store'));
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
      })
      .then(() => {
        payloadDeletion(taskData.payload);
      })
      .then(() => FirebaseTest
        .testUserApp
        .database()
        .ref('createAccount/tasks')
        .push(taskData))
      .then(() => {
        console.log(taskData);
        done(new Error('Should not be able to store'));
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
        done();
      });
  }
  it('cannot write to /createAccount/tasks with bad external_account', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.external_account = 1; },
      (payload) => { delete payload.external_account; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad email', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.email = 1; },
      (payload) => { delete payload.email; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad legal_entity', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.legal_entity.extra_prop = 'cool extra'; },
      (payload) => { delete payload.legal_entity; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad tos_acceptance', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.tos_acceptance = 1; },
      (payload) => { delete payload.tos_acceptance; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad personal_id_number', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.legal_entity.personal_id_number = 1; },
      (payload) => { delete payload.legal_entity.personal_id_number; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad first_name', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.legal_entity.first_name = 1; },
      (payload) => { delete payload.legal_entity.first_name; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad last_name', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.legal_entity.last_name = 1; },
      (payload) => { delete payload.legal_entity.last_name; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad dob', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.legal_entity.dob.extra_prop = 'cool extra prop'; },
      (payload) => { delete payload.legal_entity.dob; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad day of birth', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.legal_entity.dob.day = 'a day'; },
      (payload) => { delete payload.legal_entity.dob.day; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad month of birth', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.legal_entity.dob.month = 'a month'; },
      (payload) => { delete payload.legal_entity.dob.month; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad year of birth', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.legal_entity.dob.year = 'a year'; },
      (payload) => { delete payload.legal_entity.dob.year; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad day of birth', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.legal_entity.dob.day = 'a day'; },
      (payload) => { delete payload.legal_entity.dob.day; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad address', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.legal_entity.address.extra_prop = 'a prop'; },
      (payload) => { delete payload.legal_entity.address; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad line1', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.legal_entity.address.line1 = 1; },
      (payload) => { delete payload.legal_entity.address.line1; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad line2', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.legal_entity.address.line2 = 1; },
      (payload) => { /* Do nothing, fine to delete */ },
      done);
  });

  it('cannot write to /createAccount/tasks with bad city', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.legal_entity.address.city = 1; },
      (payload) => { delete payload.legal_entity.address.city; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad state', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.legal_entity.address.state = 1; },
      (payload) => { delete payload.legal_entity.address.state; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad postal_code', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.legal_entity.address.postal_code = 1; },
      (payload) => { delete payload.legal_entity.address.postal_code; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad tos_acceptance', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.tos_acceptance.extra_prop = 1; },
      (payload) => { delete payload.tos_acceptance; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad tos_acceptance.ip', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.tos_acceptance.ip = 1; },
      (payload) => { delete payload.tos_acceptance.ip; },
      done);
  });

  it('cannot write to /createAccount/tasks with bad tos_acceptance.date', (done) => {
    testPayloadPropertyAsValueAndAbsentFails(
      (payload) => { payload.tos_acceptance.date = "1"; },
      (payload) => { delete payload.tos_acceptance.date; },
      done);
  });
});
