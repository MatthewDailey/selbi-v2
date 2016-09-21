import Queue from 'firebase-queue';

class QueueListener {
  constructor(queueRefPath) {
    this.queueRefPath = queueRefPath;
  }

  /*
   * Initializes the QueueListener synchronously.
   *
   * @returns QueueListener this.
   */
  start(firebaseDb, queueEventHandler) {
    this.queue = new Queue(firebaseDb.ref(this.queueRefPath), queueEventHandler);
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

module.exports = QueueListener;
