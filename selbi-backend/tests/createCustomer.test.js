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
      payload: {
        source: 'stripePaymentCcToken',
        description: 'test user',
        email: 'matt@selbi.io',
      },
      metadata: {
        lastFour: 1234,
        expirationDate: '01-19',
      },
      uid: testUserUid,
    };
    writeToQueueAndExpectHandled(FirebaseTest.testUserApp, testData, done);
  });

  function writeAndExpectFailure(firebaseActionOnCreateCustomerRef, done) {
    firebaseActionOnCreateCustomerRef(FirebaseTest
      .testUserApp
      .database()
      .ref('createCustomer'))
      .then(() => {
        done(new Error('Should not be able to store'));
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

  it('cannot write to /createCustomer/tasks with different uid from auth.uid', (done) => {
    writeAndExpectFailure(
      (createCustomerRef) => createCustomerRef.child('tasks').push({
        payload: {
          source: 'stripePaymentCcToken',
          description: 'test user',
          email: 'matt@selbi.io',
        },
        metadata: {
          lastFour: 1234,
          expirationDate: '01-19',
        },
        uid: 'not the user' }), done);
  });

  it('cannot write to /createCustomer/tasks with int uid', (done) => {
    writeAndExpectFailure(
      (createCustomerRef) => createCustomerRef.child('tasks').push({
        payload: {
          source: 'stripePaymentCcToken',
          description: 'test user',
          email: 'matt@selbi.io',
        },
        metadata: {
          lastFour: 1234,
          expirationDate: '01-19',
        },
        uid: 1 }), done);
  });

  it('cannot write to /createCustomer/tasks with int description', (done) => {
    writeAndExpectFailure(
      (createCustomerRef) => createCustomerRef.child('tasks').push({
        payload: {
          source: 'stripePaymentCcToken',
          description: 1,
          email: 'matt@selbi.io',
        },
        metadata: {
          lastFour: 1234,
          expirationDate: '01-19',
        },
        uid: testUserUid }), done);
  });

  it('cannot write to /createCustomer/tasks with int source', (done) => {
    writeAndExpectFailure(
      (createCustomerRef) => createCustomerRef.child('tasks').push({
        payload: {
          source: 1,
          description: 'test user',
          email: 'matt@selbi.io',
        },
        metadata: {
          lastFour: 1234,
          expirationDate: '01-19',
        },
        uid: testUserUid }), done);
  });

  it('cannot write to /createCustomer/tasks with empty payload', (done) => {
    writeAndExpectFailure(
      (createCustomerRef) => createCustomerRef.child('tasks').push({
        payload: {},
        metadata: {
          lastFour: 1234,
          expirationDate: '01-19',
        },
        uid: testUserUid }), done);
  });

  it('cannot write to /createCustomer/tasks without metadata', (done) => {
    writeAndExpectFailure(
      (createCustomerRef) => createCustomerRef.child('tasks').push({
        payload: {
          source: 'stripePaymentCcToken',
          description: 'test user',
          email: 'matt@selbi.io',
        },
        metadata: {},
        uid: testUserUid }), done);
  });

  it('cannot write to /createCustomer/tasks with string lastFour', (done) => {
    writeAndExpectFailure(
      (createCustomerRef) => createCustomerRef.child('tasks').push({
        payload: {
          source: 'stripePaymentCcToken',
          description: 'test user',
          email: 'matt@selbi.io',
        },
        metadata: {
          lastFour: 'last 4',
          expirationDate: '01-19',
        },
        uid: testUserUid }), done);
  });

  it('cannot write to /createCustomer/tasks with int expiration date', (done) => {
    writeAndExpectFailure(
      (createCustomerRef) => createCustomerRef.child('tasks').push({
        payload: {
          source: 'stripePaymentCcToken',
          description: 'test user',
          email: 'matt@selbi.io',
        },
        metadata: {
          lastFour: 1234,
          expirationDate: 1,
        },
        uid: testUserUid }), done);
  });
});
