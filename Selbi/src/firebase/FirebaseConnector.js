import firebase from 'firebase';

const developConfig = {
  apiKey: 'AIzaSyCmaprrhrf42pFO3HAhmukTUby_mL8JXAk',
  authDomain: 'selbi-develop.firebaseapp.com',
  databaseURL: 'https://selbi-develop.firebaseio.com',
  storageBucket: 'selbi-develop.appspot.com',
};

let firebaseApp = null;

function getFirebase() {
  if (!firebaseApp) {
    firebaseApp = firebase.initializeApp(developConfig);
  }
  return firebaseApp;
}

export default undefined;

/*
 * Attempts to create a new user based on email and password.
 *
 * @returns Firebase Promise containing the User data.
 */
export function registerWithEmail(email, password) {
  return getFirebase()
    .auth()
    .createUserWithEmailAndPassword(email, password);
}

export function signInWithEmail(email, password) {
  return getFirebase()
    .auth()
    .signInWithEmailAndPassword(email, password);
}

export function getUser() {
  return getFirebase()
    .auth()
    .currentUser;
}
