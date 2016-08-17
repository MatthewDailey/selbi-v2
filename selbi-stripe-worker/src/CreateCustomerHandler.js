
/*
 * Validates the format of incoming Create Customer task.
 */
function validateData(data, reject) {
  if (!data.uid) {
    reject('Missing uid.');
    return false;
  } else if (!data.payload) {
    reject('Missing payload.');
    return false;
  } else if (!data.payload.email) {
    reject('Missing payload.email.');
    return false;
  } else if (!data.payload.source) {
    reject('Missing payload.source');
    return false;
  } else if (!data.payload.description) {
    reject('Missing payload.description');
    return false;
  } else if (!data.metadata) {
    reject('Missing metadata.');
    return false;
  } else if (!data.metadata.lastFour) {
    reject('Missing metadata.lastFour.');
    return false;
  } else if (!data.payload.expirationDate) {
    reject('Missing metadata.expirationDate');
    return false;
  }
  return true;
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
 * Steps:
 * 1) Create Stripe Connect customer.
 * 2) Store customer data in firebase to /stripeCustomer/$stripeCustomerId.
 * 3) Link to customer data from user via /users/$uid/payment/stripeCustomerId.
 * 4) Store payment metadata (such as cc last 4) in /users/$uid/payment/metadata.
 *
 * If there is a failure we write to /users/$uid/payment/status which the user will notify
 *
 */
class CreateCustomerHandler {
  constructor(firebaseDb, stripeCustomerApi) {
    this.firebaseDb = firebaseDb;
    this.stripeCustomerApi = stripeCustomerApi;
  }

  handleTask(data, progress, resolve, reject) {
    if (!validateData(data, reject)) {
      return Promise.reject(new Error());
    }

    const userRef = this.firebaseDb
      .ref('users')
      .child(data.uid);

    function storeStripeCustomerInFirebase(customerData) {
      return this.firebaseDb
        .ref('/stripeCustomer')
        .push(customerData);
    }

    function updateUserPaymentInfo(snapshot) {
      return userRef
        .child('payment')
        .set({
          stripeCustomerPointer: snapshot.key,
          status: 'OK',
          metadata: data.metadata,
        });
    }

    function updateUserEmail() {
      return userRef
        .child('email')
        .set(data.payload.email);
    }

    function updateUserPaymentStatusAndReject(error) {
      userRef
        .child('payment')
        .set({
          status: 'TODO: Error Message',
        });
      reject(error);
    }

    return createCustomer(this.stripeCustomerApi, data.payload)
      .then(storeStripeCustomerInFirebase)
      .then(updateUserPaymentInfo)
      .then(updateUserEmail)
      .catch(updateUserPaymentStatusAndReject);
  }
}

module.exports = CreateCustomerHandler;
