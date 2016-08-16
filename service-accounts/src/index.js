const developAccount = require('./../selbi-develop-service-account.json');
const productionAccount = require('./../selbi-production-service-account.json');

class ServiceAccountSupplier {
  fromEnvironment() {
    if (process.env.SELBI_ENVIRONMENT === 'production') {
      return productionAccount;
    }
    return developAccount;
  }
}

module.exports = new ServiceAccountSupplier();
