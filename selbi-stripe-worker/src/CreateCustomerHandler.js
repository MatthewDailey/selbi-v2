
/*
 * Validates the format of incoming Create Customer task.
 */
function validateData(data, reject) {
  if (!data.uid) {
    reject('Missing uid.');
  } else if (!data.payload) {
    reject('Missing payload.');
  } else if (!data.payload.email) {
    reject('Missing payload.email.');
  } else if (!data.payload.source) {
    reject('Missing payload.source');
  } else if (!data.payload.description) {
    reject('Missing payload.description');
  }
}

/*
 * This class provides the Firebase-Queue listener which is used to create a Stripe Customer
 * based on the enqueued user data.
 *
 * This create customer handler creates a stripe customer and then stores the result of that
 * data in Firebase at /customers/$uid
 */
class CreateCustomerHandler {
  constructor(firebaseDb, stripeCustomersApi) {
    this.firebaseDb = firebaseDb;
    this.stripeCustomersApi = stripeCustomersApi;
  }

  handleTask(data, progress, resolve, reject) {
    validateData(data, reject);
  }
}

module.exports = CreateCustomerHandler;
