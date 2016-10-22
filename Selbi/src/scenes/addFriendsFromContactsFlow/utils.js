import Contacts from 'react-native-contacts';
import phone from 'phone';

export default undefined;

export function normalizePhoneNumber(number) {
  const phoneNormalizationResult = phone(number);

  if (phoneNormalizationResult[0] && phoneNormalizationResult[1] === 'USA') {
    const cleanedNumber = phoneNormalizationResult[0].replace(/^\+1/, '');
    return cleanedNumber;
  }
  return null;
}

export function loadAllContactsPhoneNumber() {
  return new Promise((resolve, reject) => {
    Contacts.getAll((err, contacts) => {
      if (err && err.type === 'permissionDenied') {
        reject('Permission denied.');
      } else if (err) {
        reject(err);
      } else {
        const seenPhoneNumber = {};
        const allPhoneNumbers = [];
        contacts.forEach((contact) => {
          contact.phoneNumbers.forEach((phoneNumber) => {
            const cleanedNumber = normalizePhoneNumber(phoneNumber.number);
            if (cleanedNumber) {
              if (seenPhoneNumber[cleanedNumber]) {
                return;
              }
              seenPhoneNumber[cleanedNumber] = true;

              allPhoneNumbers.push(cleanedNumber);
            }
          });
        });
        resolve(allPhoneNumbers);
      }
    });
  });
}
