import { expect } from 'chai';
import CreateCustomerWorker from '../src/CreateCustomerWorker';

describe('CreateCustomerWorker', () => {
  it('can be created twice as long as shutdown', (done) => {
    new CreateCustomerWorker().start(() => {}).shutdown()
      .then(() => new CreateCustomerWorker().start(() => {}).shutdown())
      .then(() => done())
      .catch(done);
  });
});
