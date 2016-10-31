import { expect } from 'chai';
import ServiceAccount from '../src/index';

describe('service-accounts', () => {
  it('exports fromEnvironment', () => {
    expect(ServiceAccount.fromEnvironment()).to.exist;
  });

  it('exports firebaseConfigFromEnvironment', () => {
    expect(ServiceAccount.firebaseConfigFromEnvironment()).to.exist;
  });

  beforeEach(() => {
    process.env.SELBI_CONFIG_FILE = 'non-existant-rc-file';
  });

  after(() => {
    delete process.env.SELBI_ENVIRONMENT;
    delete process.env.SELBI_CONFIG_FILE;
  });

  it('fromEnvironment returns develop by default', () => {
    delete process.env.SELBI_ENVIRONMENT;
    expect(ServiceAccount.fromEnvironment().project_id).to.equal('selbi-develop');
  });

  it('fromEnvironment returns staging for SELBI_ENVIRONMENT=staging', () => {
    process.env.SELBI_ENVIRONMENT = 'staging';
    expect(ServiceAccount.fromEnvironment().project_id).to.equal('selbi-staging');
  });

  it('fromEnvironment returns prod for SELBI_ENVIRONMENT=production', () => {
    process.env.SELBI_ENVIRONMENT = 'production';
    expect(ServiceAccount.fromEnvironment().project_id).to.equal('selbi-production');
  });

  it('fromEnvironment returns local if rc file exists and prefers it over environment', () => {
    process.env.SELBI_ENVIRONMENT = 'production';
    process.env.SELBI_CONFIG_FILE = 'selbitest';
    expect(ServiceAccount.fromEnvironment().project_id).to.equal('service-accounts-selbi-test');
  });

  it('firebaseConfigFromEnvironment returns develop by default', () => {
    delete process.env.SELBI_ENVIRONMENT;
    const firebaseConfig = ServiceAccount.firebaseConfigFromEnvironment();
    expect(firebaseConfig.databaseURL).to.equal('https://selbi-develop.firebaseio.com');
    expect(firebaseConfig.serviceAccount.project_id).to.equal('selbi-develop');
  });

  it('firebaseConfigFromEnvironment returns staging for SELBI_ENVIRONMENT=staging', () => {
    process.env.SELBI_ENVIRONMENT = 'staging';
    const firebaseConfig = ServiceAccount.firebaseConfigFromEnvironment();
    expect(firebaseConfig.databaseURL).to.equal('https://selbi-staging.firebaseio.com');
    expect(firebaseConfig.serviceAccount.project_id).to.equal('selbi-staging');
  });

  it('firebaseConfigFromEnvironment returns prod for SELBI_ENVIRONMENT=production', () => {
    process.env.SELBI_ENVIRONMENT = 'production';
    const firebaseConfig = ServiceAccount.firebaseConfigFromEnvironment();
    expect(firebaseConfig.databaseURL).to.equal('https://selbi-production.firebaseio.com');
    expect(firebaseConfig.serviceAccount.project_id).to.equal('selbi-production');
  });

  it('fromEnvironment returns local if rc file exists and prefers it over environment', () => {
    process.env.SELBI_ENVIRONMENT = 'production';
    process.env.SELBI_CONFIG_FILE = 'selbitest';
    const firebaseConfig = ServiceAccount.firebaseConfigFromEnvironment();
    expect(firebaseConfig.databaseURL)
      .to.equal('https://service-account-selbi-test.firebaseio.com');
    expect(firebaseConfig.serviceAccount.project_id).to.equal('service-accounts-selbi-test');
  });
});
