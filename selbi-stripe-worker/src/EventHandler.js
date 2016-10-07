
export default class EventHandler {
  constructor(firebaseDb, sendNotification) {
    this.firebaseDb = firebaseDb;
    this.sendNotification = sendNotification;
  }

  getTaskHandler(eventHandlers) {
    const firebaseDb = this.firebaseDb;
    const sendNotification = this.sendNotification;

    return (data, progress, resolveTask, rejectTask) => {
      const allHandlerPromises = [];
      let acceptCount = 0;

      eventHandlers.forEach((handler) => {
        if (handler.accept(data)) {
          allHandlerPromises.push(handler.handle(data, firebaseDb, sendNotification));
          acceptCount++;
        }
      });

      console.log(
        `EventHandler (${acceptCount} / ${eventHandlers.length} handlers accepted): `,
        data);

      return Promise.all(allHandlerPromises)
        .then(() => resolveTask())
        .catch(rejectTask);
    };
  }
}
