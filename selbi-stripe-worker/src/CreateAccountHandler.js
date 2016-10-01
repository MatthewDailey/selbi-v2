
function validateData(data) {
  if (!data.uid) {
    return Promise.reject('Missing uid.');
  } else if (!data.payload) {
    return Promise.reject('Missing payload.');
  } else if (!data.payload.external_account) {
    return Promise.reject('Missing payload.external_account');
  } else if (!data.payload.email) {
    return Promise.reject('Missing payload.email');
  } else if (!data.payload.legal_entity) {
    return Promise.reject('Missing payload.legal_entity');
  } else if (!data.payload.legal_entity.dob) {
    return Promise.reject('Missing payload.legal_entity.dob');
  } else if (!data.payload.legal_entity.dob.day) {
    return Promise.reject('Missing payload.legal_entity.dob.day');
  } else if (!data.payload.legal_entity.dob.month) {
    return Promise.reject('Missing payload.legal_entity.dob.month');
  } else if (!data.payload.legal_entity.dob.year) {
    return Promise.reject('Missing payload.legal_entity.dob.year');
  } else if (!data.payload.legal_entity.address) {
    return Promise.reject('Missing payload.legal_entity.address');
  } else if (!data.payload.legal_entity.address.line1) {
    return Promise.reject('Missing payload.legal_entity.address.line1');
  } else if (!data.payload.legal_entity.address.city) {
    return Promise.reject('Missing payload.legal_entity.address.city');
  } else if (!data.payload.legal_entity.address.postal_code) {
    return Promise.reject('Missing payload.legal_entity.address.postal_code');
  } else if (!data.payload.legal_entity.address.state) {
    return Promise.reject('Missing payload.legal_entity.address.state');
  } else if (!data.payload.legal_entity.personal_id_number) {
    return Promise.reject('Missing payload.legal_entity.personal_id_number');
  } else if (!data.payload.tos_acceptance) {
    return Promise.reject('Missing payload.tos_acceptance');
  } else if (!data.payload.tos_acceptance.date) {
    return Promise.reject('Missing payload.tos_acceptance.date');
  } else if (!data.payload.tos_acceptance.ip) {
    return Promise.reject('Missing payload.tos_acceptance.ip');
  } else if (!data.metadata) {
    return Promise.reject('Missing metadata');
  } else if (!data.metadata.accountNumberLastFour) {
    return Promise.reject('Missing metadata.accountNumberLastFour');
  } else if (!data.metadata.routingNumber) {
    return Promise.reject('Missing metadata.routingNumber');
  } else if (!data.metadata.bankName) {
    return Promise.reject('Missing metadata.bankName');
  }
  return Promise.resolve();
}

/*
 * This class provides the Firebase-Queue listener which is used to create a Stripe Customer
 * based on the enqueued user data.
 *
 * Steps:
 * 1) Create Stripe Connect Account.
 * 2) Store account data in firebase to /stripeAccount/$stripeAccountId.
 * 3) Link to account data from user via /users/$uid/payment/stripeAccountId.
 * 4) Store merchant metadata (such as bank name, routing number, lastFour, owner) in
 * /users/$uid/payment/metadata.
 *
 * If there is a failure we write to /users/$uid/payment/status which the user will notify
 *
 */
class CreateCustomerHandler {
  constructor(firebaseDatabase, stripeAccountsApi) {
    this.firebaseDb = firebaseDatabase;
    this.stripe = stripeAccountsApi;
  }

  getTaskHandler() {
    const firebaseDb = this.firebaseDb;
    const stripeAccountsApi = this.stripe;
    return (data, progress, resolveCreateAccountTask, rejectCreateAccountTask) => {
      console.log(`Handling createAccout uid:${data.uid}`);

      const userRef = () => firebaseDb
        .ref('users')
        .child(data.uid);

      data.payload.managed = true;
      data.payload.country = 'US';
      data.payload.legal_entity.type = 'individual';

      const createStripeAccount = () => new Promise((resolve, reject) => {
        stripeAccountsApi.create(data.payload, (err, account) => {
          if (err) {
            reject(err);
          } else {
            resolve(account);
          }
        });
      });

      const storeStripeAccountInFirebase = (accountData) => firebaseDb
        .ref('/stripeAccount')
        .push(accountData);

      const updateUserMerchantInfo = (snapshot) => userRef()
        .child('merchant')
        .set({
          stripeAccountPointer: snapshot.key,
          status: 'OK',
          metadata: data.metadata,
        });

      const updateUserMerchantStatusAndReject = (error) => {
        console.log(error)
        rejectCreateAccountTask(error);
        return userRef()
          .child('merchant')
          .set({
            status: `ERROR creating account for user=${data.uid} error=${error}`,
          })
          .then(() => Promise.reject(error));
      };
      return validateData(data)
        .then(createStripeAccount)
        .then(storeStripeAccountInFirebase)
        .then(updateUserMerchantInfo)
        .then(resolveCreateAccountTask)
        .catch(updateUserMerchantStatusAndReject);
    };
  }
}

module.exports = CreateCustomerHandler;
