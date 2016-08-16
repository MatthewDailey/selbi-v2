import Queue from 'firebase-queue';
import firebase from 'firebase';
import ServiceAccount from '@selbi/service-accounts';

class CreateCustomerQueueListener {
  /*
   * Initializes the CreateCustomerQueueListener synchronously.
   *
   * @returns CreateCustomerQueueListener this.
   */
  start(firebaseDb, queueEventHandler) {
    this.queue = new Queue(
      firebaseDb.ref('/createCustomer'),
      queueEventHandler);
    return this;
  }

  /*
   * Shuts down the CreateCustomerQueueListener and releases all resources.
   *
   * @returns Promise which is fulfilled when shutdown is complete.
   */
  shutdown() {
    return this.queue.shutdown();
  }
}

module.exports = CreateCustomerQueueListener;
