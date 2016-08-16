import { expect } from 'chai';
import { spy } from 'sinon';
import CreateCustomerHandler from '../src/CreateCustomerHandler';

const testCreateCustomerTask = {
  payload: {
    source: 'stripePaymentCcToken',
    description: 'test user',
    email: 'matt@selbi.io',
  },
  uid: 'testUserId',
};

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/*
 * Mock the Stripe Customer API which allows us to avoid actually calling the Stripe server
 * during unit tests.
 *
 * @param error Error arg to be passed to create callback when stripe.customers.create called.
 * @param customer Customer data to be passed to create callback when stripe.customers.create
 * called.
 *
 * @returns {Object} result.api is the mock api to pass in, result.createSpy is a spy watching the
 * create method on the API object.
 */
function getSpyForStripeCustomersApi(error, customer) {
  const stripeCustomersApi = {
    create(payload, callback) {
      callback(error, customer);
    },
  };
  return {
    api: stripeCustomersApi,
    createSpy: spy(stripeCustomersApi, 'create'),
  };
}


describe('CreateCustomerHandler', () => {
  /* eslint-disable no-unused-expressions */
  /* This is necessary for the chai expect statements */

  describe('data validation', () => {
    beforeEach(function () {
      this.progress = spy();
      this.resolve = spy();
      this.reject = spy();
      this.firebaseRoot = spy();
    });

    it('must have uid', function () {
      const dataMinus = deepCopy(testCreateCustomerTask);
      delete dataMinus.uid;

      new CreateCustomerHandler(this.firebaseRoot)
        .handleTask(dataMinus, this.progress, this.resolve, this.reject);

      expect(this.reject.called).to.be.true;
      expect(this.resolve.called).to.be.false;
    });

    it('must have payload', function () {
      const dataMinus = deepCopy(testCreateCustomerTask);
      delete dataMinus.payload;

      new CreateCustomerHandler(this.firebaseRoot)
        .handleTask(dataMinus, this.progress, this.resolve, this.reject);

      expect(this.reject.called).to.be.true;
      expect(this.resolve.called).to.be.false;
    });

    it('must have payload.source', function () {
      const dataMinus = deepCopy(testCreateCustomerTask);
      delete dataMinus.payload.source;

      new CreateCustomerHandler(this.firebaseRoot)
        .handleTask(dataMinus, this.progress, this.resolve, this.reject);

      expect(this.reject.called).to.be.true;
      expect(this.resolve.called).to.be.false;
    });

    it('must have payload.description', function () {
      const dataMinus = deepCopy(testCreateCustomerTask);
      delete dataMinus.payload.description;

      new CreateCustomerHandler(this.firebaseRoot)
        .handleTask(dataMinus, this.progress, this.resolve, this.reject);

      expect(this.reject.called).to.be.true;
      expect(this.resolve.called).to.be.false;
    });

    it('must have payload.email', function () {
      const dataMinus = deepCopy(testCreateCustomerTask);
      delete dataMinus.payload.email;

      new CreateCustomerHandler(this.firebaseRoot)
        .handleTask(dataMinus, this.progress, this.resolve, this.reject);

      expect(this.reject.called).to.be.true;
      expect(this.resolve.called).to.be.false;
    });
  });

  describe('stripe calls', () => {
    beforeEach(function () {
      this.progress = spy();
      this.resolve = spy();
      this.reject = spy();
      this.firebaseDb = {};
    });

    it('calls stripe.customers.create', function (done) {
      const stripeCustomersApiMock = getSpyForStripeCustomersApi(null, { customer: 'data' });

      new CreateCustomerHandler(this.firebaseDb, stripeCustomersApiMock.api)
        .handleTask(
          deepCopy(testCreateCustomerTask),
          this.progress,
          this.resolve,
          this.reject)
        .then(() => {
          expect(stripeCustomersApiMock.createSpy.called).to.be.true;
        })
        .then(done)
        .catch(done);
    });
  });
});
