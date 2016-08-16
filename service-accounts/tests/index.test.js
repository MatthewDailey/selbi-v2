import { expect } from 'chai';
import ServiceAccount from '../src/index';

describe('service-accounts index', () => {
  it('exports fromEnvironment', () => {
    expect(ServiceAccount.fromEnvironment()).to.exist;
  });

  it('exports firebaseConfigFromEnvironment', () => {
    expect(ServiceAccount.firebaseConfigFromEnvironment()).to.exist;
  });

  after(() => {
    delete process.env.SELBI_ENVIRONMENT;
  });

  describe('fromEnvironment', () => {
    it('returns develop by default', () => {
      delete process.env.SELBI_ENVIRONMENT;
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

  describe('firebaseConfigFromEnvironment', () => {
    it('returns develop by default', () => {
      delete process.env.SELBI_ENVIRONMENT;
      const firebaseConfig = ServiceAccount.firebaseConfigFromEnvironment();
      expect(firebaseConfig.databaseURL).to.equal('https://selbi-develop.firebaseio.com');
      expect(firebaseConfig.serviceAccount.project_id).to.equal('selbi-develop');
    });

    it('returns staging for SELBI_ENVIRONMENT=staging', () => {
      process.env.SELBI_ENVIRONMENT = 'staging';
      const firebaseConfig = ServiceAccount.firebaseConfigFromEnvironment();
      expect(firebaseConfig.databaseURL).to.equal('https://selbi-staging.firebaseio.com');
      expect(firebaseConfig.serviceAccount.project_id).to.equal('selbi-staging');
    });

    it('returns prod for SELBI_ENVIRONMENT=production', () => {
      process.env.SELBI_ENVIRONMENT = 'production';
      const firebaseConfig = ServiceAccount.firebaseConfigFromEnvironment();
      expect(firebaseConfig.databaseURL).to.equal('https://selbi-production.firebaseio.com');
      expect(firebaseConfig.serviceAccount.project_id).to.equal('selbi-production');
    });
  });
});
