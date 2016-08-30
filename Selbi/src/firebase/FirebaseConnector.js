import firebase from 'firebase';
import GeoFire from 'geofire';

const developConfig = {
  apiKey: 'AIzaSyCmaprrhrf42pFO3HAhmukTUby_mL8JXAk',
  authDomain: 'selbi-develop.firebaseapp.com',
  databaseURL: 'https://selbi-develop.firebaseio.com',
  storageBucket: 'selbi-develop.appspot.com',
};

// Note that this also reloads user auth settings. Therefore, this must not be loaded lazily.
const firebaseApp = firebase.initializeApp(developConfig);

export default undefined;


export function getUser() {
  return firebaseApp
    .auth()
    .currentUser;
}

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

function insertUserInDatabase(firstName, lastName) {
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

export function signInWithEmail(email, password) {
  return firebaseApp
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => firebaseApp.database().ref('users').child(getUser().uid).once('value'))
    .then((userSnapshot) => {
      if (!userSnapshot.exists()) {
        const currentUser = getUser();
        const names = currentUser.displayName.split(' ');
        return insertUserInDatabase(names[0], names[1]);
      }
      return Promise.resolve();
    });
}

export function signOut() {
  return firebaseApp
    .auth()
    .signOut();
}

export function createUser(firstName, lastName) {
  return getUser()
    .updateProfile({
      displayName: `${firstName} ${lastName}`,
    })
    .then(() => insertUserInDatabase(firstName, lastName));
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

/*
 * This code snippet demonstrates how to change the status of a user's listing.
 *
 * This is useful when a user published a listing for any other local user to see or when they
 * want to depublish a listing.
 *
 * Note that the performance of this could be by knowing the prior status of the listing. We have
 * avoided fully parallelizing updating the /listings/$listingId/status because that should serve
 * as the source of truth. By waiting, we know that if that update fails, none of the secondary
 * indexes will be corrupted.
 *
 * @param {string} newStatus String new status for the listing.
 * @param {string} listingId String id of the listing to make public.
 * @param {FirebaseDatabase} firebaseDb We pass in the database in this sample test.
 * @param {Array of [lat, lon]} latlon for the newly public object, pulled from app location or
 * user input address.
 *
 * @returns DataSnapshot of the old listing prior to updating the status.
 */
export function changeListingStatus(newStatus, listingId, latlon) {
  // Start by loading the existing snapshot and verifying it exists.
  return firebaseApp
    .database()
    .ref('listings')
    .child(listingId)
    .once('value')
    .then((snapshot) => {
      if (snapshot.exists()) {
        // Update status on /listing data.
        return firebaseApp
          .database()
          .ref('listings')
          .child(listingId)
          .update({
            status: newStatus,
          })
          .then(() => Promise.resolve(snapshot));
      }
      throw new Error('No such listing.');
    })
    .then((oldSnapshot) => {
      const allUpdatePromises = [];

      allUpdatePromises.push(firebaseApp
        .database()
        .ref('/userListings')
        .child(oldSnapshot.val().sellerId)
        .child(oldSnapshot.val().status)
        .child(listingId)
        .remove());

      allUpdatePromises.push(firebaseApp
        .database()
        .ref('/userListings')
        .child(oldSnapshot.val().sellerId)
        .child(newStatus)
        .child(listingId)
        .set(true));

      if (newStatus === 'public') {
        allUpdatePromises.push(new GeoFire(firebaseApp.database().ref('/geolistings'))
          .set(listingId, latlon));
      } else {
        allUpdatePromises.push(new GeoFire(firebaseApp.database().ref('/geolistings'))
          .remove(listingId));
      }

      return Promise.all(allUpdatePromises)
        .then(() => Promise.resolve(oldSnapshot));
    });
}

/*
 * This code snippet shows how to load a single listing from the db once you have the listing's id.
 *
 * @param listingId String id of the listing to load.
 *
 * @returns Promise fulfilled with DataSnapshot of the listing if the listing exists.
 */
function loadListingData(listingId) {
  return firebaseApp
    .database()
    .ref('/listings')
    .child(listingId)
    .once('value');
}

export function loadImage(imageId) {
  return firebaseApp
    .database()
    .ref('/images')
    .child(imageId)
    .once('value');
}

/*
 * This code snippet demonstrates how to load all public listings at a certain location.
 *
 * This is useful for the 'nearby-listings' view for listings within X km of the user. See
 * https://github.com/firebase/geofire-js/blob/master/docs/reference.md for more info about GeoFire.
 *
 * Note that this will fail if ANY listing fails to load.
 *
 * @param latlon Array of [lat, lon], pulled from user device (either address or device location).
 * @param radiusKm Number of km radius to search around latlon.
 *
 * @return Promise fulfilled with list of listing DataSnapshots.
 */
export function loadListingByLocation(latlon, radiusKm) {
  const geoListings = new GeoFire(firebaseApp.database().ref('/geolistings'));

  const geoQuery = geoListings.query({
    center: latlon,
    radius: radiusKm,
  });

  return new Promise((fulfill) => {
    const listingsInArea = [];
    const loadListingsPromises = [];

    geoQuery.on('key_entered', (listingId) => {
      // Once we know the listing id of a listing in the area, start loading the listing data.
      loadListingsPromises.push(
        loadListingData(listingId)
          .then((snapshot) => {
            if (snapshot.exists()) {
              listingsInArea.push(snapshot);
            }
          }));
    });

    // Ready is called once all pre-existing data has been read.
    geoQuery.on('ready', () => {
      geoQuery.cancel();

      // Now wait on loading the actual listing data.
      Promise.all(loadListingsPromises)
        .then(() => {
          fulfill(listingsInArea);
        });
    });
  });
}
