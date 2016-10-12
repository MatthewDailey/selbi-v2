
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

  handle(data, firebaseDb, sendNotification, sendSms) {
    return Promise.resolve();
  }
}
