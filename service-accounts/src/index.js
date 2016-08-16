const developAccount = require('../selbi-develop-service-account.json');
const stagingAccount = require('../selbi-staging-service-account.json');
const productionAccount = require('../selbi-production-service-account.json');

class ServiceAccountSupplier {
  fromEnvironment() {
    if (process.env.SELBI_ENVIRONMENT === 'production') {
      return productionAccount;
    }
    if (process.env.SELBI_ENVIRONMENT === 'staging') {
      return stagingAccount;
    }
    return developAccount;
  }

  firebaseConfigFromEnvironment() {
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
