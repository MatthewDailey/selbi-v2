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

describe('Create Customer', () => {
  beforeEach((done) => {
    FirebaseTest
      .serviceAccountApp
      .database()
      .ref('/createCustomer')
      .remove()
      .then(done);
  });

  function writeToQueueAndExpectHandled(firebaseUserApp, testData, done) {
    new Queue(
      FirebaseTest.serviceAccountApp.database().ref('/createCustomer'),
      testSafeWorker(
        (data) => {
          expect(data.foo).to.equal(testData.foo);
        },
        done));

    firebaseUserApp
      .database()
      .ref('/createCustomer/tasks')
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
      stripePaymentSource: 'stripePaymentCcToken',
      customerName: 'test user',
      customerUid: testUserUid,
    };
    writeToQueueAndExpectHandled(FirebaseTest.testUserApp, testData, done);
  });

  function writeAndExpectFailure(firebaseActionOnCreateCustomerRef, done) {
    firebaseActionOnCreateCustomerRef(FirebaseTest
      .testUserApp
      .database()
      .ref('createCustomer'))
      .then(() => {
        done(new Error('Should not be able to store directly to /createCustomer'));
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
        done();
      });
  }

  it('cannot write directly to /createCustomer as user', (done) => {
    writeAndExpectFailure((createCustomerRef) => createCustomerRef.push({ foo: 'bar' }), done);
  });

  it('cannot write to /createCustomer/specs as user', (done) => {
    writeAndExpectFailure(
      (createCustomerRef) => createCustomerRef.child('specs').push({ foo: 'bar' }), done);
  });

  it('cannot write to /createCustomer/tasks with bad data', (done) => {
    writeAndExpectFailure(
      (createCustomerRef) => createCustomerRef.child('tasks').push({ foo: 'bar' }), done);
  });
});
