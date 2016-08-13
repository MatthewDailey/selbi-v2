import { expect } from 'chai';
import CreateCustomerWorker from '../src/CreateCustomerWorker';

describe('CreateCustomerWorker', () => {
  it('can instantiate', () => {
    // noinspection Eslint
    expect(new CreateCustomerWorker()).to.not.be.null;
  });

  it('can bind to queue and shutdown', () => {
    const worker = new CreateCustomerWorker();
    worker.start();
    worker.shutdown();
  });
});
