import { expect } from 'chai';
import ServiceAccount from '../index';

describe('service-accounts index', () => {
  it('exports fromEnvironment', () => {
    expect(ServiceAccount.fromEnvironment()).to.exist;
  });

  it('fromEnvironment returns develop by default', () => {
    expect(ServiceAccount.fromEnvironment().project_id).to.equal('selbi-develop');
  });
});
