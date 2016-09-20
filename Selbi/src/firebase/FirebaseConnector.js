import firebase from 'firebase';
import GeoFire from 'geofire';
import FCM from 'react-native-fcm';
import Config from 'react-native-config';

import { convertToUsername } from './FirebaseUtils';

const developConfig = {
  apiKey: Config.FIREBASE_API_KEY,
  authDomain: Config.FIREBASE_AUTH_DOMAIN,
  databaseURL: Config.FIREBASE_DATABASE_URL,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
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

export function setUserFcmToken(fcmToken) {
  if (!getUser()) {
    return Promise.reject('Not signed in.');
  }
  console.log('-----about to set fcmToken----------')
  console.log(fcmToken);
  return firebaseApp
    .database()
    .ref('/users')
    .child(getUser().uid)
    .update({
      fcmToken
    });
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

/*
 * @returns username if name is available, undefined otherwise.
 */
function checkUsernameTaken(username) {
  return firebaseApp.database()
    .ref('usernames')
    .child(username)
    .once('value')
    .then((usernameSnapshot) => {
      if (usernameSnapshot.exists()) {
        return undefined;
      }
      return username;
    });
}

function getValidUsername(userDisplayName) {
  const usernameBase = convertToUsername(userDisplayName);
  let usernameIndex = 0;

  const getUsernameWithIndex = (usernameAttempt) => checkUsernameTaken(usernameAttempt)
    .then((validUsername) => {
      console.log(`Checked name ${usernameAttempt} and got ${validUsername}`);
      if (validUsername) {
        return validUsername;
      }
      return getUsernameWithIndex(`${usernameBase}${usernameIndex++}`);
    });

  return getUsernameWithIndex(usernameBase);
}

function insertUserInDatabase(userDisplayName) {
  const promiseUserPublicDataAndUsername = getValidUsername(userDisplayName)
    .then((validUsername) => {
      const promiseUserPublicData = firebaseApp
        .database()
        .ref('/userPublicData')
        .child(getUser().uid)
        .set({
          username: validUsername,
          displayName: userDisplayName,
        });
      const promiseUsername = firebaseApp
        .database()
        .ref('/usernames')
        .child(validUsername)
        .set(getUser().uid);
      return Promise.all([promiseUserPublicData, promiseUsername]);
    });

  const promiseUsers = firebaseApp
    .database()
    .ref('/users')
    .child(getUser().uid)
    .set({
      userAgreementAccepted: false,
    });

  return Promise.all([promiseUsers, promiseUserPublicDataAndUsername]);
}

export function signInWithEmail(email, password) {
  return firebaseApp
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => firebaseApp.database().ref('users').child(user.uid).once('value'))
    .then((userSnapshot) => {
      if (!userSnapshot || !userSnapshot.exists()) {
        return insertUserInDatabase(getUser().displayName)
          .then(() => {
            FCM.requestPermissions(); // for iOS
            return FCM.getFCMToken();
          })
          .then(setUserFcmToken)
          .then(() => Promise.resolve(getUser().uid));
      }

      FCM.requestPermissions(); // for iOS
      return FCM.getFCMToken()
        .then(setUserFcmToken)
        .then(() => Promise.resolve(getUser().uid));
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

export function updateListing(listingId, title, description, price, images) {
  const listing = {
    title,
    description,
    price,
  };

  if (images) {
    listing.images = images;
  }

  console.log(listing)

  const listingRef = firebaseApp.database().ref('/listings').child(listingId);

  return listingRef.update(listing);
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
export function loadListingData(listingId) {
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
          listingKey: listingId,
          listingData: listingSnapShot.val(),
        });
      } else {
        throw new Error('could not find listing');
      }
    })
    .catch((error) => {
      console.log(error);
      // No listing found so return nothing.
      return Promise.resolve(undefined);
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
          .then((listingTitleData) => {
            if (!listingTitleData) {
              return Promise.resolve(undefined);
            }

            return Promise.resolve(Object.assign(listingTitleData, {
              buyerUid: getUser().uid,
              type: 'buying',
            }));
          })
      ));
    }

    if (sellingData) {
      Object.keys(sellingData).forEach((listingId) => {
        Object.keys(sellingData[listingId]).forEach((buyerUid) => chatPromises.push(
          getListingTitle(listingId)
            .then((listingTitleData) => {
              if (!listingTitleData) {
                return Promise.resolve(undefined);
              }

              return Promise.resolve(Object.assign(listingTitleData, {
                buyerUid: buyerUid,
                type: 'selling',
              }));
            })
          )
        );
      });
    }
  }

  return Promise.all(chatPromises);
}

function loadUserListingsByStatus(uid, status) {
  return firebaseApp
    .database()
    .ref('/userListings')
    .child(uid)
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

export function loadFriendsListings() {
  return firebaseApp.database()
    .ref('following')
    .child(getUser().uid)
    .once('value')
    .then((followingSnapshot) => {
      if (followingSnapshot.exists()) {
        const listingsListsPromises = [];
        console.log(followingSnapshot.val());
        Object.keys(followingSnapshot.val()).forEach(
          (friendUid) => {
            listingsListsPromises.push(loadUserListingsByStatus(friendUid, 'public'));
            listingsListsPromises.push(loadUserListingsByStatus(friendUid, 'private'));
          });
        return Promise.all(listingsListsPromises);
      }
      return Promise.resolve([]);
    })
    .then((listOfListingsLists) => [].concat.apply([], listOfListingsLists));
}

export function addFriend(friendUsername) {
  return firebaseApp.database()
    .ref('usernames')
    .child(friendUsername)
    .once('value')
    .then((friendUsernameSnapshot) => {
      if (friendUsernameSnapshot.exists()) {
        return friendUsernameSnapshot.val();
      }
      return Promise.reject();
    })
    .then((friendUid) => firebaseApp.database()
      .ref('following')
      .child(getUser().uid)
      .child(friendUid)
      .set(true));
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
  console.log(`user: ${getUser().uid}`);
  const newMessageRef = firebaseApp
    .database()
    .ref('messages')
    .child(listingId)
    .child(buyerUid)
    .push()

  firebaseApp
    .database()
    .ref('messageNotifications/tasks')
    .push({
      listingId,
      buyerId: buyerUid,
      messageId: newMessageRef.key,
    });

  return newMessageRef
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

export function loadLocationForListing(listingId) {
  const geoListings = new GeoFire(firebaseApp.database().ref('/geolistings'));

  return geoListings.get(listingId);
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
  return loadUserListingsByStatus(getUser().uid, status);
}

// Must be logged in first.
export function listenToListingsByStatus(status, callback) {
  firebaseApp
    .database()
    .ref('/userListings')
    .child(getUser().uid)
    .child(status)
    .on('value', (snapshot) => {
      if (snapshot.exists()) {
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
    .off('value', callback);
}