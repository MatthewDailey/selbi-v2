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

const authStateChangeListeners = [];

firebaseApp.auth().onAuthStateChanged((user) => {
  console.log(`auth state changed --- signed in = ${user !== undefined}`);
  authStateChangeListeners.forEach((listener) => listener(user));
});

export function addAuthStateChangeListener(listener) {
  authStateChangeListeners.push(listener);
}

export function removeAuthStateChangeListener(listener) {
  authStateChangeListeners.splice(authStateChangeListeners.indexOf(listener), 1);
}

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

function insertUserInDatabase(userDisplayName) {
  const promiseUserPublicData = firebaseApp
    .database()
    .ref('/userPublicData')
    .child(getUser().uid)
    .set({
      displayName: userDisplayName,
    });

  const promiseUsers = firebaseApp
    .database()
    .ref('/users')
    .child(getUser().uid)
    .set({
      userAgreementAccepted: false,
    });

  return Promise.all([promiseUsers, promiseUserPublicData]);
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
        return insertUserInDatabase(`${names[0]} ${names[1]}`);
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
  const userDisplayName = `${firstName} ${lastName}`;
  return getUser()
    .updateProfile({
      displayName: userDisplayName,
    })
    .then(() => insertUserInDatabase(userDisplayName));
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

export function createChatAsBuyer(listingId, sellerUid) {
  const promiseSetSellerPointer = firebaseApp
    .database()
    .ref('chats')
    .child(sellerUid)
    .child('selling')
    .child(listingId)
    .child(getUser().uid)
    .set(true);

  const promiseSetBuyerPoiner = firebaseApp
    .database()
    .ref('chats')
    .child(getUser().uid)
    .child('buying')
    .child(listingId)
    .set(true);

  return Promise.all([promiseSetBuyerPoiner, promiseSetSellerPointer]);
}

function getListingTitle(listingId) {
  return loadListingData(listingId)
    .then((listingSnapShot) => {
      if (listingSnapShot.exists()) {
        return Promise.resolve({
          title: listingSnapShot.val().title,
          listingId: listingId,
          sellerUid: listingSnapShot.val().sellerId,
        });
      } else {
        throw new Error('could not find listing');
      }
    })
    .catch(() => {
      return Promise.resolve({
        title: 'No listing found for this chat.',
      });
    });
}

function loadChatDetailsFromUserChats(userChatsData) {
  const chatPromises = [];

  if (userChatsData.exists()) {
    console.log(`user chats data as ${getUser().uid}`);
    console.log(userChatsData.val());
    const buyingData = userChatsData.val().buying;
    const sellingData = userChatsData.val().selling;

    if (buyingData) {
      Object.keys(buyingData).forEach((listingId) => chatPromises.push(
        getListingTitle(listingId)
          .then((listingTitleData) =>
            Promise.resolve(Object.assign(listingTitleData, {
              buyerUid: getUser().uid,
              type: 'buying',
            })))
      ));
    }

    if (sellingData) {
      console.log()
      Object.keys(sellingData).forEach((listingId) => {
        Object.keys(sellingData[listingId]).forEach((buyerUid) => chatPromises.push(
          getListingTitle(listingId)
            .then((listingTitleData) =>
              Promise.resolve(
                Object.assign(listingTitleData, { buyerUid: buyerUid, type: 'selling' }))))
        );
      });
    }
  }

  return Promise.all(chatPromises);
}

export function loadAllUserChats() {
  return firebaseApp
    .database()
    .ref('chats')
    .child(getUser().uid)
    .once('value')
    .then(loadChatDetailsFromUserChats);
}

export function loadUserPublicData(uid) {
  return firebaseApp
    .database()
    .ref('userPublicData')
    .child(uid)
    .once('value');
}

/*
 * chatData must have:
 * - sellerUid
 * - buyerUid
 * - listingId
 */
export function loadMessages(listingId, buyerUid) {
  return firebaseApp
    .database()
    .ref('messages')
    .child(listingId)
    .child(buyerUid)
    .once('value');
}

export function sendMessage(listingId, buyerUid, messageText) {
  console.log(`user: ${getUser().uid}`)
  return firebaseApp
    .database()
    .ref('messages')
    .child(listingId)
    .child(buyerUid)
    .push()
    .set({
      text: messageText,
      authorUid: getUser().uid,
      createdAt: new Date().getTime(),
    });
}

/*
 * Listen for new messages for a specific chat.
 *
 * @returns unsubscribe function.
 */
export function subscribeToNewMessages(listingId, buyerUid, callback) {
  firebaseApp
    .database()
    .ref('messages')
    .child(listingId)
    .child(buyerUid)
    .on('child_added', callback);
  return () => firebaseApp
    .database()
    .ref('messages')
    .child(listingId)
    .child(buyerUid)
    .off('child_added', callback);
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

/*
 * This code snippet shows how to load listings based on the status, for example, load all private
 * listings for a given user.
 *
 * This is useful for loading listings of users a user is following by first loading the user's
 * friends and then loading their public and private listings. It's also useful for loading a
 * user's inventory of listings.
 *
 * Note that this will fail if ANY listing fails to load.
 *
 * @param status String status of listings to load. Must be inactive, public, private, sold,
 * salePending.
 *
 * @returns Promise fulfilled with list of listings of a given status.
 */
export function loadListingsByStatus(status) {
  if (!getUser()) {
    return Promise.resolve([]);
  }

  return firebaseApp
    .database()
    .ref('/userListings')
    .child(getUser().uid)
    .child(status)
    .once('value')
    .then((snapshot) => {
      if (snapshot.exists()) {
        return Promise.resolve(snapshot.val());
      }
      return Promise.resolve({});
    })
    .then((listingsOfStatus) => {
      const allListings = [];
      Object.keys(listingsOfStatus)
        .forEach((listingId) => {
          allListings.push(
            firebaseApp
              .database()
              .ref('/listings')
              .child(listingId)
              .once('value'));
        });
      return Promise.all(allListings);
    });
}

// Must be logged in first.
export function listenToListingsByStatus(status, callback) {
  console.log('called listen to listings by status');
  firebaseApp
    .database()
    .ref('/userListings')
    .child(getUser().uid)
    .child(status)
    .on('value', (snapshot) => {
      console.log('called on value for ' + status);
      if (snapshot.exists()) {
        console.log('snapshot exists');
        const allListings = [];
        Object.keys(snapshot.val())
          .forEach((listingId) => {
            allListings.push(
              firebaseApp
                .database()
                .ref('/listings')
                .child(listingId)
                .once('value'));
          });
        Promise
          .all(allListings)
          .then(callback);
      } else {
        callback([]);
      }
    });
  return () => firebaseApp
    .database()
    .ref('/userListings')
    .child(getUser().uid)
    .child(status)
    .off(callback);
}