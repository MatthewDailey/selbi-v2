import firebase from 'firebase';

const developConfig = {
  apiKey: 'AIzaSyCmaprrhrf42pFO3HAhmukTUby_mL8JXAk',
  authDomain: 'selbi-develop.firebaseapp.com',
  databaseURL: 'https://selbi-develop.firebaseio.com',
  storageBucket: 'selbi-develop.appspot.com',
};

// Note that this also reloads user auth settings. Therefore, this must not be loaded lazily.
const firebaseApp = firebase.initializeApp(developConfig);

export default undefined;

/*
 * Attempts to create a new user based on email and password.
 *
 * @returns Firebase Promise containing the User data.
 */
export function registerWithEmail(emailInput, passwordInput) {
  return firebaseApp
    .auth()
    .createUserWithEmailAndPassword(emailInput, passwordInput);
}

export function signInWithEmail(email, password) {
  return firebaseApp
    .auth()
    .signInWithEmailAndPassword(email, password);
}

export function getUser() {
  return firebaseApp
    .auth()
    .currentUser;
}

export function createUser(firstName, lastName) {
  return firebaseApp
    .database()
    .ref('/users')
    .child(getUser().uid)
    .set({
      name: {
        first: firstName,
        last: lastName,
      },
      userAgreementAccepted: false,
    });
}

export function publishImage(base64, heightInput, widthInput) {
  const imageData = {
    owner: getUser().uid,
    base64: base64,
    height: heightInput,
    width: widthInput,
  };

  return firebaseApp
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
  const newListingRef = firebaseApp.database().ref('/listings').push();

  const createUserListing = () => firebaseApp
    .database()
    .ref('/userListings')
    .child(uid)
    .child('inactive')
    .child(newListingRef.key)
    .set(true);

  return newListingRef
    .set(listing)
    .then(createUserListing)
    .then(() => Promise.resolve(newListingRef.key));
}
