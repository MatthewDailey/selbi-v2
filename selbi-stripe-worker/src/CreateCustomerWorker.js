import Queue from 'firebase-queue';
import firebase from 'firebase';

class CreateCustomerWorker {

  constructor() {
    const serviceAccountConfig = {
      serviceAccount: '../firebase-service-accounts/service-account.json',
      databaseURL: 'https://selbi-staging.firebaseio.com',
    };

    this.firebaseApp = firebase.initializeApp(serviceAccountConfig);
  }

  start() {

  }

  shutdown() {

  }
}

module.exports = CreateCustomerWorker;
