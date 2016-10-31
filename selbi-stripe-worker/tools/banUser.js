import ServiceAccount from '@selbi/service-accounts';
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp(ServiceAccount.firebaseConfigFromEnvironment(),
  'serviceUser');

const uid = process.argv[4];
const isBanned = process.argv[5] === 'true';

if (!uid) {
  throw new Error('Must pass uid');
}

firebaseApp
  .database()
  .ref('bannedUsers')
  .child(uid)
  .set(isBanned)
  .then(() => {
    console.log(`Successfully set user ${uid} banned=${isBanned}`);
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
