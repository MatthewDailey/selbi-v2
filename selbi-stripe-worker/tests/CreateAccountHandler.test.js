import { expect } from 'chai';
import { spy, stub } from 'sinon';
import FirebaseTest, { minimalUserUid } from '@selbi/firebase-test-resource';
import CreateAccountHandler from '../src/CreateAccountHandler';

const testCreateAccountTask = {
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
  uid: minimalUserUid,
  metadata: {
    accountNumberLastFour: 4444,
    routingNumber: 325181028,
    bankName: 'WSECU',
  },
};

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/*
 * Mock the Stripe Account API which allows us to avoid actually calling the Stripe server
 * during unit tests.
 *
 * @param error Error arg to be passed to create callback when stripe.accounts.create called.
 * @param account Account data to be passed to create callback when stripe.accounts.create
 * called.
 *
 * @returns {Object} result.api is the mock api to pass in, result.createSpy is a spy watching the
 * create method on the API object.
 */
function getSpyForStripeAccountsApi(error, account) {
  const stripeAccountsApi = {
    create(payload, callback) {
      callback(error, account);
    },
  };
  return {
    api: stripeAccountsApi,
    createSpy: spy(stripeAccountsApi, 'create'),
  };
}

describe('CreateAccountHandler', () => {
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
      const testData = deepCopy(testCreateAccountTask);
      manipulateData(testData);
      new CreateAccountHandler(stub())
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

    it('must have payload.external_account', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.external_account;
      }, done);
    });

    it('must have payload.legal_entity', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.legal_entity;
      }, done);
    });

    it('must have payload.legal_entity.dob', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.legal_entity.dob;
      }, done);
    });

    it('must have payload.legal_entity.dob.day', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.legal_entity.dob.day;
      }, done);
    });

    it('must have payload.legal_entity.dob.month', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.legal_entity.dob.month;
      }, done);
    });

    it('must have payload.legal_entity.dob.year', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.legal_entity.dob.year;
      }, done);
    });

    it('must have payload.email', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.email;
      }, done);
    });

    it('must have payload.address', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.legal_entity.address;
      }, done);
    });

    it('must have payload.address.line1', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.legal_entity.address.line1;
      }, done);
    });

    it('must have payload.address.city', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.legal_entity.address.city;
      }, done);
    });

    it('must have payload.address.postal_code', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.legal_entity.postal_code;
      }, done);
    });

    it('must have payload.address.state', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.legal_entity.address.state;
      }, done);
    });

    it('must have payload.tos_acceptance', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.tos_acceptance;
      }, done);
    });

    it('must have payload.tos_acceptance.date', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.tos_acceptance.date;
      }, done);
    });

    it('must have payload.tos_acceptance', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.payload.tos_acceptance.ip;
      }, done);
    });

    it('must have metadata', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.metadata;
      }, done);
    });

    it('must have metadata.accountNumberLastFour', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.metadata.accountNumberLastFour;
      }, done);
    });

    it('must have metadata.routingNumber', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.metadata.routingNumber;
      }, done);
    });

    it('must have metadata.bankName', (done) => {
      attemptWithDataAndExpectValidationFailure((data) => {
        // noinspection Eslint
        delete data.metadata.bankName;
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

    it('calls stripe.accounts.create', function (done) {
      const stripeAccountsApiMock = getSpyForStripeAccountsApi(null, { account: 'data' });

      new CreateAccountHandler(
        FirebaseTest.serviceAccountApp.database(),
        stripeAccountsApiMock.api)
        .getTaskHandler()(
          deepCopy(testCreateAccountTask),
          this.progress,
          this.resolve,
          this.reject)
        .then(() => {
          expect(stripeAccountsApiMock.createSpy.called).to.be.true;
        })
        .then(done)
        .catch(done);
    });
  });
});
