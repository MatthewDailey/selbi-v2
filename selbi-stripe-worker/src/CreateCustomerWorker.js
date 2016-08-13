import Queue from 'firebase-queue';
import firebase from 'firebase';
import { serviceAccountJsonPath } from './ServiceAccountProvider';

class CreateCustomerWorker {

  constructor() {
    const serviceAccountConfig = {
      serviceAccount: serviceAccountJsonPath,
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
