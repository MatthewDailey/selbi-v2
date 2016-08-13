import { expect } from 'chai';
import CreateCustomerWorker from '../src/CreateCustomerWorker';

describe('CreateCustomerWorker', () => {
  it('can instantiate', () => {
    // noinspection Eslint
    expect(new CreateCustomerWorker()).to.not.be.null;
  });
});
