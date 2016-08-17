import { expect } from 'chai';
import sinon from 'sinon';
import firebase from 'firebase';
import ServiceAccount from '@selbi/service-accounts';
import QueueListener from '../src/QueueListener';

const testUserUid = 'CreateCustomerQueueListener-TestUser';

const testCreateCustomerData = {
  payload: {
    source: 'stripePaymentCcToken',
    description: 'test user',
    email: 'matt@selbi.io',
  },
  uid: testUserUid,
};

const testCreateAccountData = {
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

describe('QueueListener', () => {
  before(function (done) {
    this.timeout(5000);

    this.firebaseApp = firebase.initializeApp(
      ServiceAccount.firebaseConfigFromEnvironment(),
      'test-driver');

    this.firebaseApp
      .database()
      .ref('/')
      .remove()
      .then(() => this.firebaseApp
        .database()
        .ref('/users')
        .child(testUserUid)
        .set({
          message: 'This is a strawman. The CreateCustomerQueueListener test does not care ' +
          'about user data integrity.',
        }))
      .then(done)
      .catch(done);
  });

  after(function (done) {
    this.firebaseApp
      .delete()
      .then(done)
      .catch(done);
  });

  it('can be created twice as long as shutdown', function (done) {
    new QueueListener('/createCustomer')
      .start(this.firebaseApp.database(), () => {})
      .shutdown()
      .then(() => new QueueListener('/createCustomer')
        .start(this.firebaseApp.database(), () => {})
        .shutdown())
      .then(() => done())
      .catch(done);
  });

  describe('createCustomer Queue Listening', function () {
    this.timeout(5000);

    beforeEach(function () {
      this.worker = new QueueListener('/createCustomer');
    });

    afterEach(function (done) {
      this.worker
        .shutdown()
        .then(() => done())
        .catch(done);
    });

    it('does not call queueHandler off the bat', function () {
      const queueHandler = sinon.spy();

      this.worker.start(this.firebaseApp.database(), queueHandler);

      expect(queueHandler.called).to.equal(false);
    });

    it('calls handler when data is queued', function (done) {
      const queueHandler = sinon.spy((data, progress, resolve, reject) => {
        expect(data.uid).to.equal(testUserUid);
        resolve()
          .then(done);
      });

      this.worker.start(this.firebaseApp.database(), queueHandler);

      this.firebaseApp
        .database()
        .ref('/createCustomer/tasks')
        .push(testCreateCustomerData)
        .catch(done);
    });
  });

  describe('createAccount Queue Listening', function () {
    this.timeout(5000);

    beforeEach(function () {
      this.worker = new QueueListener('/createAccount');
    });

    afterEach(function (done) {
      this.worker
        .shutdown()
        .then(() => done())
        .catch(done);
    });

    it('does not call queueHandler off the bat', function () {
      const queueHandler = sinon.spy();

      this.worker.start(this.firebaseApp.database(), queueHandler);

      expect(queueHandler.called).to.equal(false);
    });

    it('calls handler when data is queued', function (done) {
      const queueHandler = sinon.spy((data, progress, resolve, reject) => {
        expect(data.uid).to.equal(testUserUid);
        resolve()
          .then(done);
      });

      this.worker.start(this.firebaseApp.database(), queueHandler);

      this.firebaseApp
        .database()
        .ref('/createAccount/tasks')
        .push(testCreateAccountData)
        .catch(done);
    });
  });
});
