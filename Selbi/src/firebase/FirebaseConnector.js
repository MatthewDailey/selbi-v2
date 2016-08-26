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
export function registerWithEmail(emailInput, passwordInput) {
  return getFirebase()
    .auth()
    .createUserWithEmailAndPassword(emailInput, passwordInput);
}

export function signInWithEmail(email, password) {
  return getFirebase()
    .auth()
    .signInWithEmailAndPassword(email, password);
}

export function getUser() {
  return getFirebase()
    .auth()
    .currentUser;u
}

export function createUser() {
  return getFirebase()
    .database()
    .ref('/users')
    .child(getUser().uid)
    .set({
      userAgreementAccepted: false,
    });
}

export function publishImage(base64, heightInput, widthInput) {
  const imageData = {
    owner: getUser().uid,
    base64: base64,
    height: heightInput,
    width: widthInput,
  }

  console.log(imageData);
  return getFirebase()
    .database()
    .ref('images')
    .push(imageData)
    .then((snapshot) => Promise.resolve(snapshot.key));
}

export function createListing(titleInput,
                       descriptionInput,
                       priceInput,
                       imagesInput,
                       categoryInput) {
  // TODO: Add validation of args for cleaner failures.
  const uid = getUser().uid;

  const listing = {
    title: titleInput,
    description: descriptionInput,
    price: priceInput,
    images: imagesInput,
    category: categoryInput,
    sellerId: uid,
    status: 'inactive',
  };

  // Get an id for the new listing.
  const newListingRef = getFirebase().database().ref('/listings').push();

  const createUserListing = () => getFirebase()
    .database()
    .ref('/userListings')
    .child(uid)
    .child('inactive')
    .child(newListingRef.key)
    .set(true);

  console.log(listing)

  return newListingRef
    .set(listing)
    .then(createUserListing)
    .then(() => Promise.resolve(newListingRef.key));
}
