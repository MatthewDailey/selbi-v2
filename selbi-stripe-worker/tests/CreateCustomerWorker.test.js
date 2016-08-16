import { expect } from 'chai';
import sinon, { once } from 'sinon';
import CreateCustomerWorker from '../src/CreateCustomerWorker';

describe('CreateCustomerWorker', () => {
  it('can be created twice as long as shutdown', (done) => {
    new CreateCustomerWorker().start(() => {}).shutdown()
      .then(() => new CreateCustomerWorker().start(() => {}).shutdown())
      .then(() => done())
      .catch(done);
  });

  describe('queue listening', () => {
    it('sinon test', () => {
      const callback = sinon.spy();

      callback();

      expect(callback.called).to.be.true;
    });
  });
});
