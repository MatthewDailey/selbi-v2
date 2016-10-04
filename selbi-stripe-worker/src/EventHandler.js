
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

      eventHandlers.forEach((handler) => {
        if (handler.accept(data)) {
          allHandlerPromises.push(handler.handle(data, firebaseDb, sendNotification));
        }
      });

      return Promise.all(allHandlerPromises)
        .then(() => resolveTask())
        .catch(rejectTask);
    };
  }
}
