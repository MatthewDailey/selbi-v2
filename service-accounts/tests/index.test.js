import { expect } from 'chai';
import ServiceAccount from '../src/index';

describe('service-accounts index', () => {
  it('exports fromEnvironment', () => {
    expect(ServiceAccount.fromEnvironment()).to.exist;
  });

  it('exports firebaseConfigFromEnvironment', () => {
    expect(ServiceAccount.firebaseConfigFromEnvironment()).to.exist;
  });

  describe('fromEnvironment', () => {
    it('returns develop by default', () => {
      expect(ServiceAccount.fromEnvironment().project_id).to.equal('selbi-develop');
    });

    it('returns staging for SELBI_ENVIRONMENT=staging', () => {
      process.env.SELBI_ENVIRONMENT = 'staging';
      expect(ServiceAccount.fromEnvironment().project_id).to.equal('selbi-staging');
    });

    it('returns prod for SELBI_ENVIRONMENT=production', () => {
      process.env.SELBI_ENVIRONMENT = 'production';
      expect(ServiceAccount.fromEnvironment().project_id).to.equal('selbi-production');
    });
  });
});
