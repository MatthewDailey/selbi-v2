import rc from 'rc';

const developAccount = require('../selbi-develop-service-account.json');
const stagingAccount = require('../selbi-staging-service-account.json');
const productionAccount = require('../selbi-production-service-account.json');

function getLocalConfig() {
  const rcFilePath = process.env.SELBI_CONFIG_FILE ? process.env.SELBI_CONFIG_FILE : 'selbi';
  return rc(rcFilePath, {});
}

class ServiceAccountSupplier {
  fromEnvironment() {
    const localSelbiConfig = getLocalConfig();

    if (localSelbiConfig.firebaseServiceAccount) {
      return localSelbiConfig.firebaseServiceAccount;
    }
    if (process.env.SELBI_ENVIRONMENT === 'production') {
      return productionAccount;
    }
    if (process.env.SELBI_ENVIRONMENT === 'staging') {
      return stagingAccount;
    }
    return developAccount;
  }

  firebaseConfigFromEnvironment() {
    const localSelbiConfig = getLocalConfig();

    if (!!localSelbiConfig.firebaseServiceAccount && !!localSelbiConfig.firebasePublicConfig) {
      return {
        serviceAccount: localSelbiConfig.firebaseServiceAccount,
        databaseURL: localSelbiConfig.firebasePublicConfig.databaseURL,
      };
    }
    if (process.env.SELBI_ENVIRONMENT === 'production') {
      return {
        serviceAccount: productionAccount,
        databaseURL: 'https://selbi-production.firebaseio.com',
      };
    }
    if (process.env.SELBI_ENVIRONMENT === 'staging') {
      return {
        serviceAccount: stagingAccount,
        databaseURL: 'https://selbi-staging.firebaseio.com',
      };
    }
    return {
      serviceAccount: developAccount,
      databaseURL: 'https://selbi-develop.firebaseio.com',
    };
  }
}

module.exports = new ServiceAccountSupplier();
