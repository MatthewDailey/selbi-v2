import Queue from 'firebase-queue';
import firebase from 'firebase';
import { serviceAccountJsonPath } from './ServiceAccountProvider';

class CreateCustomerWorker {
  /*
   * Initializes the CreateCustomerWorker synchronously.
   *
   * @returns CreateCustomerWorker this.
   */
  start() {
    const serviceAccountConfig = {
      serviceAccount: serviceAccountJsonPath,
      databaseURL: 'https://selbi-staging.firebaseio.com',
    };

    this.firebaseApp = firebase.initializeApp(serviceAccountConfig, 'create-customer');
    return this;
  }

  /*
   * Shuts down the CreateCustomerWorker and releases all resources.
   *
   * @returns Promise which is fulfilled when shutdown is complete.
   */
  shutdown() {
    if (this.firebaseApp) {
      return this.firebaseApp.delete();
    }
    return Promise.resolve();
  }
}

module.exports = CreateCustomerWorker;
