
require('babel-core/register');

const developAccount = require('./../selbi-develop-service-account.json');

class ServiceAccountSupplier {
  fromEnvironment() {
    return developAccount;
  }
}

module.exports = new ServiceAccountSupplier();
