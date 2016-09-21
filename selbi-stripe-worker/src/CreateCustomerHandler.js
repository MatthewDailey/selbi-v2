
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
  } else if (!data.metadata.cardBrand) {
    return Promise.reject('Missing metadata.cardBrand');
  }
  return Promise.resolve();
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
  constructor(firebaseDatabase, stripeCustomersApi) {
    this.firebaseDb = firebaseDatabase;
    this.stripeCustomersApi = stripeCustomersApi;
  }

  getTaskHandler() {
    const firebaseDb = this.firebaseDb;
    const stripeCustomersApi = this.stripeCustomersApi;
    return (data, progress, resolveCreateCustomerTask, rejectCreateCustomerTask) => {
      console.log(`Handling createCustomer uid:${data.uid}`);

      const userRef = () => firebaseDb
        .ref('users')
        .child(data.uid);

      const createStripeCustomer = () => new Promise((resolve, reject) => {
        stripeCustomersApi.create(data.payload, (err, customer) => {
          if (err) {
            reject(err);
          } else {
            resolve(customer);
          }
        });
      });

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

      function updateUserPaymentStatusAndReject(error) {
        rejectCreateCustomerTask(error);
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
        .then(resolveCreateCustomerTask)
        .catch(updateUserPaymentStatusAndReject);
    };
  }
}

module.exports = CreateCustomerHandler;
