let serviceAccountJsonPath = '../firebase-service-accounts/'
  + 'selbi-staging-schema-test-service-account.json';

if (process.env.ENVIRONMENT === 'production') {
  serviceAccountJsonPath = '../firebase-service-accounts/'
    + 'selbi-production-service-account.json';
}

module.exports.serviceAccountJsonPath = serviceAccountJsonPath;
