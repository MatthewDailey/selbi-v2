
const VERIFY_PHONE_EVENT = 'verify-phone';


function validateData(data) {
  if (!data.payload || !data.payload.phoneNumber) {
    return Promise.reject('verify-phone event did not have phoneNumber');
  }
  if (!data.payload || !data.payload.code) {
    return Promise.reject('verify-phone event did not have phoneNumber');
  }
  return Promise.resolve();
}

export default class VerifyPhoneHandler {
  accept(data) {
    return data.type === VERIFY_PHONE_EVENT;
  }

  handle(data, firebaseDb) {
    return validateData(data)
      .then(() => firebaseDb
        .ref('phoneVerification')
        .child(data.payload.phoneNumber)
        .once('value'))
      .then((phoneVerificationSnapshot) => {
        if (phoneVerificationSnapshot.exists()) {
          return Promise.resolve(phoneVerificationSnapshot.val());
        }
        return Promise.reject('No verification code for phone.');
      })
      .then((phoneVerification) => {
        const phoneToUserRef = firebaseDb
          .ref('phoneToUser')
          .child(data.payload.phoneNumber);
        if (phoneVerification === data.payload.code) {
          return phoneToUserRef.set(data.owner);
        }
        return Promise.reject('Verification code did not match.');
      })
      .catch((errorMessage) => firebaseDb
        .ref('phoneToUser')
        .child(data.payload.phoneNumber)
        .set(errorMessage));
  }
}
