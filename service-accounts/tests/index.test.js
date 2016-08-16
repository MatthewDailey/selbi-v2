import { expect } from 'chai';
import ServiceAccount from '../src/index';

describe('service-accounts index', () => {
  it('exports fromEnvironment', () => {
    expect(ServiceAccount.fromEnvironment()).to.exist;
  });

  describe('fromEnvironment', () => {
    it('fromEnvironment returns develop by default', () => {
      expect(ServiceAccount.fromEnvironment().project_id).to.equal('selbi-develop');
    });

    it('fromEnvironment returns prod for SELBI_ENVIRONMENT=production', () => {
      process.env.SELBI_ENVIRONMENT = 'production';
      expect(ServiceAccount.fromEnvironment().project_id).to.equal('selbi-production');
    });
  });
});
