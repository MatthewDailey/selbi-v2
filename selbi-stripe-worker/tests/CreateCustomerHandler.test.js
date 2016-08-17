import { expect } from 'chai';
import { spy, stub } from 'sinon';
import FirebaseTest, { minimalUserUid } from '@selbi/firebase-test-resource';
import CreateCustomerHandler from '../src/CreateCustomerHandler';


const testCreateCustomerTask = {
  payload: {
    source: 'stripePaymentCcToken',
    description: 'test user',
    email: 'matt@selbi.io',
  },
  metadata: {
    lastFour: 1234,
    expirationDate: '01-19',
    cardBrand: 'Visa',
  },
  uid: minimalUserUid,
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
    let progress = spy();
    let resolve = spy();
    let reject = spy();
    beforeEach(() => {
      progress = spy();
      resolve = spy();
      reject = spy();
    });

    function attemptWithDataAndExpectValidationFailure(manipulateData, done) {
      const testData = deepCopy(testCreateCustomerTask);
      manipulateData(testData);
      new CreateCustomerHandler(stub())
        .getTaskHandler()(testData, progress, resolve, reject)
        .then(() => {
          done(new Error('Should have failed data validation.'));
        })
        .catch(() => {
          expect(reject.called).to.be.true;
          expect(resolve.called).to.be.false;
          done();
        })
        .catch(done);
    }

    it('must have uid', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.uid;
      }, done);
    });

    it('must have payload', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload;
      }, done);
    });

    it('must have payload.source', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.source;
      }, done);
    });

    it('must have payload.description', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.description;
      }, done);
    });

    it('must have payload.email', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.email;
      }, done);
    });

    it('must have metadata', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.metadata;
      }, done);
    });

    it('must have metadata.lastFour', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.metadata.lastFour;
      }, done);
    });

    it('must have metadata.expirationDate', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.metadata.expirationDate;
      }, done);
    });

    it('must have metadata.cardBrand', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.metadata.cardBrand;
      }, done);
    });
  });

  describe('stripe calls', () => {
    before(function (done) {
      this.timeout(5000);

      FirebaseTest
        .dropDatabase()
        .then(() => FirebaseTest.createMinimalUser())
        .then(done)
        .catch(done);
    });

    beforeEach(function () {
      this.progress = spy();
      this.resolve = spy();
      this.reject = spy();
    });

    it('calls stripe.customers.create', function (done) {
      const stripeCustomersApiMock = getSpyForStripeCustomersApi(null, { customer: 'data' });

      new CreateCustomerHandler(
        FirebaseTest.serviceAccountApp.database(),
        stripeCustomersApiMock.api)
        .getTaskHandler()(
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
