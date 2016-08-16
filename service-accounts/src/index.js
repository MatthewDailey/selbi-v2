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
}

module.exports = new ServiceAccountSupplier();
