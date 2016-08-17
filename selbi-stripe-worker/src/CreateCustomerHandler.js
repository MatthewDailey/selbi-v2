
/*
 * Validates the format of incoming Create Customer task.
 */
function validateData(data) {
  if (!data.uid) {
    return Promise.reject('Missing uid.');
  } else if (!data.payload) {
    return Promise.reject('Missing payload.');
  } else if (!data.payload.email) {
    return Promise.reject('Missing payload.email.');
  } else if (!data.payload.source) {
    return Promise.reject('Missing payload.source');
  } else if (!data.payload.description) {
    return Promise.reject('Missing payload.description');
  } else if (!data.metadata) {
    return Promise.reject('Missing metadata.');
  } else if (!data.metadata.lastFour) {
    return Promise.reject('Missing metadata.lastFour.');
  } else if (!data.metadata.expirationDate) {
    return Promise.reject('Missing metadata.expirationDate');
  }
  return Promise.resolve();
}

/*
 * This method demonstrates how to create a Customer which can be used for repeated payments. It
 * is intended to be run server side.
 *
 * @param payload.source String token returned to the client device from Stripe when a payment
 * source was created.
 * @param payload.description String describing the customer.
 * @param payload.email String email of the customer.
 *
 * @returns Promise fulfilled with client data.
 */
// function createStripeCustomer(stripeCustomerApi, payload) {
//   return new Promise((resolve, reject) => {
//     stripeCustomerApi.create(payload, (err, customer) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(customer);
//       }
//     });
//   });
// }

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
  constructor(firebaseDatabase, stripeCustomerApi) {
    this.firebaseDb = firebaseDatabase;
    this.stripeCustomerApi = stripeCustomerApi;
  }

  getTaskHandler() {
    const firebaseDb = this.firebaseDb
    const stripeAPI = this.stripeCustomerApi;
    return (data, progress, resolve, reject) => {
      const userRef = () => firebaseDb
        .ref('users')
        .child(data.uid);

      const storeStripeCustomerInFirebase = (customerData) => firebaseDb
        .ref('/stripeCustomer')
        .push(customerData);

      const updateUserPaymentInfo = (snapshot) => userRef()
        .child('payment')
        .set({
          stripeCustomerPointer: snapshot.key,
          status: 'OK',
          metadata: data.metadata,
        });

      const updateUserEmail = () => userRef()
        .child('email')
        .set(data.payload.email);

      const createStripeCustomer = () => new Promise((resolveStripeCreate, rejectStripeCreate) => {
        stripeAPI.create(data.payload, (err, customer) => {
          if (err) {
            rejectStripeCreate(err);
          } else {
            resolveStripeCreate(customer);
          }
        });
      });

      function updateUserPaymentStatusAndReject(error) {
        reject(error);
        return userRef()
          .child('payment')
          .set({
            status: `ERROR creating customer for user=${data.uid} error=${error}`,
          })
          .then(() => Promise.reject(error));
      }

      return validateData(data)
        .then(createStripeCustomer)
        .then(storeStripeCustomerInFirebase)
        .then(updateUserPaymentInfo)
        .then(updateUserEmail)
        .then(resolve)
        .catch(updateUserPaymentStatusAndReject);
    };
  }
}

module.exports = CreateCustomerHandler;
