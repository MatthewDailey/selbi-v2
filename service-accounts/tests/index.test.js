import { expect } from 'chai';
import ServiceAccount from '../index';

describe('service-accounts index', () => {
  it('exports getFromEnvironment', () => {
    expect(ServiceAccount.fromEnvironment()).to.not.be.null;
  });
});
