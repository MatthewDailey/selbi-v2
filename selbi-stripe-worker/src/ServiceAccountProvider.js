let serviceAccountJsonPath = '../service-accounts/'
  + 'selbi-develop-service-account.json';

if (process.env.ENVIRONMENT === 'staging') {
  serviceAccountJsonPath = '../service-accounts/'
    + 'selbi-staging-service-account.json';
} else if (process.env.ENVIRONMENT === 'production') {
  serviceAccountJsonPath = '../service-accounts/'
    + 'selbi-production-service-account.json';
}

module.exports.serviceAccountJsonPath = serviceAccountJsonPath;
