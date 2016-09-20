import firebase from 'firebase';

// TODO: Enable specifying environment.
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

module.exports.getFirebase = getFirebase;
