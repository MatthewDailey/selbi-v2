import { expect } from 'chai';
import sinon from 'sinon';
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

describe('CreateCustomerHandler', () => {
  describe('data validation', () => {
    beforeEach(function () {
      this.progress = sinon.spy();
      this.resolve = sinon.spy();
      this.reject = sinon.spy();
      this.firebaseRoot = sinon.spy();
    });

    it('must have uid', function() {
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
});
