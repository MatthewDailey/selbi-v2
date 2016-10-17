
const ADD_PHONE_EVENT = 'add-phone';

const possibleCodeCharacters = '0123456789';
const numCharactersInCode = 4;
function generateCode() {
  let text = '';
  for (let i = 0; i < numCharactersInCode; i++) {
    text += possibleCodeCharacters.charAt(
      Math.floor(Math.random() * possibleCodeCharacters.length));
  }
  return text;
}

function validateData(data) {
  if (!data.payload || !data.payload.phoneNumber) {
    return Promise.reject('add-phone event did not have phoneNumber');
  }
  return Promise.resolve();
}

export default class CreatePhoneVerificationHandler {
  accept(data) {
    return data.type === ADD_PHONE_EVENT;
  }

  handle(data, firebaseDb, sendNotification, sendSms) {
    const verificationCode = generateCode();

    return validateData(data)
      .then(() => firebaseDb
        .ref('phoneVerification')
        .child(data.payload.phoneNumber)
        .set(verificationCode))
      .then(() => sendSms(data.payload.phoneNumber, `Your Selbi code is: ${verificationCode}`));
  }

}
