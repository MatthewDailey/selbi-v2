
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
 */
class CreateCustomerHandler {
  handleCreateCustomer(data, progress, resolve, reject) {
    validateData(data, reject);
  }
}

module.exports = new CreateCustomerHandler();
