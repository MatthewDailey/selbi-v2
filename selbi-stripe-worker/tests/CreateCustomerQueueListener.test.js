import { expect } from 'chai';
import sinon from 'sinon';
import firebase from 'firebase';
import ServiceAccount from '@selbi/service-accounts';
import CreateCustomerQueueListener from '../src/CreateCustomerQueueListener';

const testUserUid = 'CreateCustomerQueueListener-TestUser';

const testCreateCustomerData = {
  payload: {
    source: 'stripePaymentCcToken',
    description: 'test user',
    email: 'matt@selbi.io',
  },
  uid: testUserUid,
};

describe('CreateCustomerWorker', () => {
  let firebaseApp = null;

  before(function (done) {
    this.timeout(5000);

    firebaseApp = firebase.initializeApp(
      ServiceAccount.firebaseConfigFromEnvironment(),
      'test-driver');

    firebaseApp
      .database()
      .ref('/')
      .remove()
      .then(() => firebaseApp
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

  after((done) => {
    firebaseApp
      .delete()
      .then(done)
      .catch(done);
  });

  it('can be created twice as long as shutdown', (done) => {
    new CreateCustomerQueueListener().start(() => {}).shutdown()
      .then(() => new CreateCustomerQueueListener().start(() => {}).shutdown())
      .then(() => done())
      .catch(done);
  });

  describe('queue listening', function () {
    this.timeout(5000);

    beforeEach(function () {
      this.worker = new CreateCustomerQueueListener();
    });

    afterEach(function (done) {
      this.worker
        .shutdown()
        .then(() => done())
        .catch(done);
    });

    it('does not call queueHandler off the bat', function () {
      const queueHandler = sinon.spy();

      this.worker.start(queueHandler);

      expect(queueHandler.called).to.be.false;
    });

    it('calls handler when data is queued', function (done) {
      const queueHandler = sinon.spy((data, progress, resolve, reject) => {
        expect(data.uid).to.equal(testUserUid);
        resolve()
          .then(done);
      });

      this.worker.start(queueHandler);

      firebaseApp
        .database()
        .ref('/createCustomer/tasks')
        .push(testCreateCustomerData)
        .catch(done);
    });
  });
});
