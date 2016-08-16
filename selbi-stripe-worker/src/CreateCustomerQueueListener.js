import Queue from 'firebase-queue';
import firebase from 'firebase';
import ServiceAccount from '@selbi/service-accounts';

class CreateCustomerWorker {
  /*
   * Initializes the CreateCustomerQueueListener synchronously.
   *
   * @returns CreateCustomerQueueListener this.
   */
  start(queueEventHandler) {
    this.firebaseApp = firebase.initializeApp(
      ServiceAccount.firebaseConfigFromEnvironment(),
      'create-customer');

    this.queue = new Queue(
      this.firebaseApp.database().ref('/createCustomer'),
      queueEventHandler);
    return this;
  }

  /*
   * Shuts down the CreateCustomerQueueListener and releases all resources.
   *
   * @returns Promise which is fulfilled when shutdown is complete.
   */
  shutdown() {
    const allShutdownPromises = [];
    if (this.firebaseApp) {
      allShutdownPromises.push(this.firebaseApp.delete());
    }
    if (this.queue) {
      allShutdownPromises.push(this.queue.shutdown());
    }
    return Promise.all(allShutdownPromises);
  }
}

module.exports = CreateCustomerWorker;
