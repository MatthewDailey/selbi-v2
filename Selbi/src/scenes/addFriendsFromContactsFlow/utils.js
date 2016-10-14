import Contacts from 'react-native-contacts';

export default undefined;

export function normalizePhoneNumber(number) {
  const cleanedNumber = number
    .replace(/-/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/\s/g, '')
    .replace(/\+1/g, '');
  return cleanedNumber;
}

export function loadAllContactsPhoneNumber() {
  return new Promise((resolve, reject) => {
    Contacts.getAll((err, contacts) => {
      if (err && err.type === 'permissionDenied') {
        reject('Permission denied.');
      } else if (err) {
        reject(err);
      } else {
        const allPhoneNumbers = [];
        contacts.forEach((contact) => {
          contact.phoneNumbers.forEach((phone) =>
            allPhoneNumbers.push(normalizePhoneNumber(phone.number)));
        });
        resolve(allPhoneNumbers);
      }
    });
  });
}
