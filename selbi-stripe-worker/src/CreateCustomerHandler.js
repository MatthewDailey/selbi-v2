
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
 * This method demonstrates how to create a Customer which can be used for repeated payments. It
 * is intended to be run server side.
 *
 * @param payload.source String token returned to the client device from Stripe when a payment
 * source was created.
 * @param payload.description String describing the customer.
 * @param payload.email
 *
 * @returns Promise fulfilled with client data.
 */
function createCustomer(stripeCustomerApi, payload) {
  return new Promise((resolve, reject) => {
    stripeCustomerApi.create(payload, (err, customer) => {
      if (err) {
        reject(err);
      } else {
        resolve(customer);
      }
    });
  });
}


/*
 * This class provides the Firebase-Queue listener which is used to create a Stripe Customer
 * based on the enqueued user data.
 *
 * This create customer handler creates a stripe customer and then stores the result of that
 * data in Firebase at /customers/$uid
 */
class CreateCustomerHandler {
  constructor(firebaseDb, stripeCustomerApi) {
    this.firebaseDb = firebaseDb;
    this.stripeCustomerApi = stripeCustomerApi;
  }

  handleTask(data, progress, resolve, reject) {
    validateData(data, reject);

    return createCustomer(this.stripeCustomerApi, data.payload)
      .then((customerData) => {
        console.log(customerData)
        // update firebase db.
      })
      .catch((error) => reject(error));
  }
}

module.exports = CreateCustomerHandler;
