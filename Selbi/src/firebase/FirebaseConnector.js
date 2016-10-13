import firebase from 'firebase';
import GeoFire from 'geofire';
import FCM from 'react-native-fcm';
import {LoginManager, AccessToken } from 'react-native-fbsdk';


import { convertToUsername } from './FirebaseUtils';
import config from '../../config';

console.log('Initializing firebase', config.firebase);

// Note that this also reloads user auth settings. Therefore, this must not be loaded lazily.
const firebaseApp = firebase.initializeApp(config.firebase);

export default undefined;

const authStateChangeListeners = [];

firebaseApp.auth().onAuthStateChanged((user) => {
  console.log(`auth state changed --- signed in = ${!!user}`);
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
      email: getUser().email,
      userAgreementAccepted: false,
    });

  return Promise.all([promiseUsers, promiseUserPublicDataAndUsername]);
}

export function signInWithFacebook() {
  const auth = firebase.auth();
  const provider = firebase.auth.FacebookAuthProvider;

  return LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email'])
    .then(loginResult => {
      console.log('log in returned');
      console.log(loginResult);

      if (loginResult.isCancelled) {
        return Promise.reject('User cancelled sign in.');
      }
      return AccessToken.getCurrentAccessToken();
    })
    .then(accessTokenData => {
      const credential = provider.credential(accessTokenData.accessToken);
      return auth.signInWithCredential(credential);
    });
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


export function createUser(displayName, email) {
  if (!getUser()) {
    return Promise.reject('Must be signed in to store user details.');
  }

  return getUser().updateProfile({ displayName })
    .then(() => getUser().updateEmail(email))
    .then(() => firebaseApp.database().ref('users').child(getUser().uid).once('value'))
    .then((userSnapshot) => {
      if (!userSnapshot || !userSnapshot.exists()) {
        return insertUserInDatabase(displayName);
      }
      return Promise.resolve();
    })
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

  const recordNewListingEvent = () => firebaseApp
    .database()
    .ref('events/tasks')
    .push()
    .set({
      owner: uid,
      timestamp: new Date().getTime(),
      type: 'new-listing',
      payload: {
        listingId: newListingRef.key,
      },
    });

  return newListingRef
    .set(listing)
    .then(createUserListing)
    .then(recordNewListingEvent)
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

function getListingKeyAndData(listingId) {
  return loadListingData(listingId)
    .then((listingSnapShot) => {
      if (listingSnapShot.exists()) {
        return Promise.resolve({
          listingKey: listingId,
          listingData: listingSnapShot.val(),
        });
      } else {
        throw new Error(`could not find listing ${listingId}`);
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
        getListingKeyAndData(listingId)
          .then((listingKeyAndData) => {
            if (!listingKeyAndData) {
              return Promise.resolve(undefined);
            }

            return Promise.resolve(Object.assign(listingKeyAndData, {
              buyerUid: getUser().uid,
              type: 'buying',
            }));
          })
      ));
    }

    if (sellingData) {
      Object.keys(sellingData).forEach((listingId) => {
        Object.keys(sellingData[listingId]).forEach((buyerUid) => chatPromises.push(
          getListingKeyAndData(listingId)
            .then((listingKeyAndData) => {
              if (!listingKeyAndData) {
                return Promise.resolve(undefined);
              }

              return Promise.resolve(Object.assign(listingKeyAndData, {
                buyerUid,
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

export function followUser(uid) {
  if (!getUser()) {
    return Promise.reject('Must be signed in to follow another user.')
  }

  const addFollowingPromise = firebaseApp.database()
    .ref('following')
    .child(getUser().uid)
    .child(uid)
    .set(true);

  const addFollowerPromise = firebaseApp.database()
    .ref('followers')
    .child(uid)
    .child(getUser().uid)
    .set(true);

  return Promise.all([addFollowerPromise, addFollowingPromise])
    .then(firebaseApp.database()
      .ref('events/tasks')
      .push()
      .set({
        type: 'follow',
        timestamp: new Date().getTime(),
        owner: getUser().uid,
        payload: {
          leader: uid,
        },
      }));
}

export function addFriendByUsername(friendUsername) {
  return firebaseApp.database()
    .ref('usernames')
    .child(friendUsername)
    .once('value')
    .then((friendUsernameSnapshot) => {
      if (friendUsernameSnapshot.exists()) {
        return friendUsernameSnapshot.val();
      }
      return Promise.reject(`Unable to find user @${friendUsername}.`);
    })
    .then(followUser);
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

export function watchUserPublicData(uid, handler) {
  firebaseApp
    .database()
    .ref('userPublicData')
    .child(uid)
    .on('value', handler);

  return () => firebaseApp
    .database()
    .ref('userPublicData')
    .child(uid)
    .off('value', handler);
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
  const newMessageRef = firebaseApp
    .database()
    .ref('messages')
    .child(listingId)
    .child(buyerUid)
    .push();

  return newMessageRef
    .set({
      text: messageText,
      authorUid: getUser().uid,
      createdAt: new Date().getTime(),
    })
    .then(() => firebaseApp
      .database()
      .ref('messageNotifications/tasks')
      .push({
        listingId,
        buyerId: buyerUid,
        messageId: newMessageRef.key,
      }));
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
    const listingsInArea = {};
    const loadListingsPromises = [];

    geoQuery.on('key_entered', (listingId) => {
      // Once we know the listing id of a listing in the area, start loading the listing data.
      loadListingsPromises.push(
        loadListingData(listingId)
          .then((snapshot) => {
            if (snapshot.exists()) {
              listingsInArea[snapshot.key] = snapshot;
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

export function listenToListingsByLocation(latlon,
                                           radiusKm,
                                           enterHandler,
                                           exitHandler) {
  const geoListings = new GeoFire(firebaseApp.database().ref('/geolistings'));

  const geoQuery = geoListings.query({
    center: latlon,
    radius: radiusKm,
  });

  if (enterHandler) {
    geoQuery.on('key_entered', (listingId) => {
      loadListingData(listingId)
        .then((snapshot) => {
          if (snapshot.exists()) {
            enterHandler(snapshot);
          }
        });
    });
  }

  if (exitHandler) {
    geoQuery.on('key_exited', exitHandler);
  }

  return geoQuery;
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

function computeExpirationDate(expMonth, expYear) {
  if (expMonth < 10) {
    return `0${expMonth}-${expYear % 100}`;
  }
  return `${expMonth}-${expYear % 100}`;
}

function markUserHasPayment() {
  // Note that this will fail if the user does not have any public data already.
  return firebaseApp.database()
    .ref('userPublicData')
    .child(getUser().uid)
    .child('hasPayment')
    .set(true);
}

export function enqueueCreateCustomerRequest(cardHolderName, email, stripeCreateCardResponse) {
  if (!getUser()) {
    return Promise.reject('Must be signed in.');
  }

  const createCustomerTask = {
    uid: getUser().uid,
    payload: {
      source: stripeCreateCardResponse.id,
      description: `${cardHolderName}'s Credit Card`,
      email,
    },
    metadata: {
      lastFour: stripeCreateCardResponse.card.last4,
      expirationDate: computeExpirationDate(
        stripeCreateCardResponse.card.exp_month,
        stripeCreateCardResponse.card.exp_year),
      cardBrand: stripeCreateCardResponse.card.brand,
    },
  };

  return new Promise((resolve, reject) => {
    const userPaymentRef = firebaseApp.database()
      .ref('users')
      .child(getUser().uid)
      .child('payment');

    let isFirstLoadOfPayments = true;
    const handlePaymentsUpdates = (paymentData) => {
      if (isFirstLoadOfPayments) {
        isFirstLoadOfPayments = false;

        // Wait to enqueue until we know we're listening for updates to user status.
        firebaseApp.database()
          .ref('createCustomer/tasks')
          .push()
          .set(createCustomerTask);
        return;
      }

      if (paymentData.exists()) {
        if (paymentData.val().status === 'OK') {
          markUserHasPayment()
            .then(() => resolve(paymentData.val()))
            .catch((error) => {
              reject(error);
              console.log(error);
            });
        } else {
          reject(paymentData.val().status);
        }
      } else {
        reject('An unknown error occured setting up payment data.');
      }
      userPaymentRef.off('value', handlePaymentsUpdates);
    };

    userPaymentRef.on('value', handlePaymentsUpdates);
  });
}

function markUserHasMerchant() {
  // Note that this will fail if the user does not have any public data already.
  return firebaseApp.database()
    .ref('userPublicData')
    .child(getUser().uid)
    .child('hasBankAccount')
    .set(true);
}

export function enqueueCreateAccountRequest(
  bankToken,
  ssnLast4,
  firstName,
  lastName,
  dob, // { day, month, year }
  address, // { line1, line2, city, postal_code, state }
  email,
  ip,
  accountNumberLastFour,
  routingNumber,
  bankName) {
  if (!getUser()) {
    return Promise.reject('Must sign in first.');
  }

  const createAccountTask = {
    payload: {
      external_account: bankToken,
      email,
      legal_entity: {
        ssn_last_4: ssnLast4,
        first_name: firstName,
        last_name: lastName,
        dob,
        address,
      },
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip,
      },
    },
    uid: getUser().uid,
    metadata: {
      accountNumberLastFour,
      routingNumber,
      bankName,
    },
  };

  console.log(createAccountTask);

  const userMerchantRef = firebaseApp.database()
    .ref('users')
    .child(getUser().uid)
    .child('merchant');

  const clearUserPublicBankAccountData = () => firebaseApp.database()
    .ref('userPublicData')
    .child(getUser().uid)
    .child('hasBankAccount')
    .remove();

  // Remove the merchant data.
  return userMerchantRef
    .remove()
    .then(clearUserPublicBankAccountData)
    .then(() => new Promise((resolve, reject) => {
      let isFirstLoadOfMerchant = true;
      const handleMerchantUpdates = (merchantData) => {
        if (isFirstLoadOfMerchant) {
          isFirstLoadOfMerchant = false;

          // Wait to enqueue until we know we're listening for updates to user status.
          firebaseApp.database()
            .ref('createAccount/tasks')
            .push()
            .set(createAccountTask)
            .catch((error) => {
              console.log(error);
              reject('An unknown error occured setting up merchant data.');
              userMerchantRef.off('value', handleMerchantUpdates);
            });
          return;
        }

        if (merchantData.exists()) {
          if (merchantData.val().status === 'OK') {
            markUserHasMerchant()
              .then(() => resolve(merchantData.val()))
              .catch((error) => {
                reject(error);
                console.log(error);
              });
          } else {
            reject(merchantData.val().status);
          }
        } else {
          reject('An unknown error occured setting up merchant data.');
        }
        userMerchantRef.off('value', handleMerchantUpdates);
      };
      userMerchantRef.on('value', handleMerchantUpdates);
    }));
}

export function purchaseListing(listingId) {
  if (!getUser()) {
    return Promise.reject('Must sign in first.');
  }

  const awaitPurchaseResult = () => new Promise((resolve, reject) => {
    const purchaseStatusRef = firebaseApp
      .database()
      .ref('users')
      .child(getUser().uid)
      .child('purchases')
      .child(listingId)
      .child('status');
    console.log('awaiting purchase  ')

    const handlePurchaseUpdate = (statusSnapshot) => {
      if (statusSnapshot.exists()) {
        const status = statusSnapshot.val();
        if (status === 'in-progress') {
          return;
        } else if (status === 'success') {
          resolve();
          purchaseStatusRef.off('value', handlePurchaseUpdate);
        } else {
          reject(status);
          purchaseStatusRef.off('value', handlePurchaseUpdate);
        }
      }
    };
    purchaseStatusRef.on('value', handlePurchaseUpdate);
  });

  return firebaseApp
    .database()
    .ref('createPurchase/tasks')
    .push()
    .set({
      listingId,
      buyerUid: getUser().uid,
    })
    .then(awaitPurchaseResult);
}

/*
 * listed for updates on a specific listing.
 *
 * @returns a function which will detach the listener.
 */
export function listenToListing(listingId, listener) {
  const listenForValueIgnoreEmpty = (listingSnapshot) => {
    if (listingSnapshot && listingSnapshot.exists()) {
      listener(listingSnapshot.val());
    }
  };

  firebaseApp
    .database()
    .ref('listings')
    .child(listingId)
    .on('value', listenForValueIgnoreEmpty);

  return () => firebaseApp
    .database()
    .ref('listings')
    .child(listingId)
    .off('value', listenForValueIgnoreEmpty);
}

export function followListingSeller(listingId) {
  if (!getUser()) {
    return Promise.reject('Must be signed in to follow another user');
  }

  return loadListingData(listingId)
    .then((listingSnapshot) => {
      if (listingSnapshot.exists()) {
        return listingSnapshot.val();
      }
      return Promise.reject(`Unable to follow owner of ${listingId}. Listing does not exists`);
    })
    .then((listingData) => {
      if (getUser().uid !== listingData.sellerId) {
        followUser(listingData.sellerId);
      }
    });
}

export function listenToBulletins(bulletinsHandler) {
  if (!getUser()) {
    return undefined;
  }

  const handleSnapshot = (bulletinsSnapshot) => {
    if (bulletinsSnapshot.exists()) {
      bulletinsHandler(bulletinsSnapshot.val());
    } else {
      bulletinsHandler({});
    }
  };

  // Fetch this before since we'll be signed out during call to returned unwatch method.
  const uid = getUser().uid;

  firebaseApp
    .database()
    .ref('userBulletins')
    .child(uid)
    .on('value', handleSnapshot);

  return () => {
    firebaseApp
      .database()
      .ref('userBulletins')
      .child(uid)
      .off('value');
  };
}

export function updateBulletin(bulletinId, updatedValue) {
  if (!getUser()) {
    return Promise.reject('Must be signed in to update a bulletin.');
  }

  return firebaseApp
    .database()
    .ref('userBulletins')
    .child(getUser().uid)
    .child(bulletinId)
    .update(updatedValue);
}

function requireSignedIn() {
  if (!getUser()) {
    return Promise.reject('Must be signed in.');
  }
  return Promise.resolve();
}

export function enqueuePhoneNumber(phoneNumber) {
  return requireSignedIn()
    .then(() => firebaseApp
      .database()
      .ref('events/tasks')
      .push()
      .set({
        owner: getUser().uid,
        type: 'add-phone',
        timestamp: new Date().getTime(),
        payload: {
          phoneNumber,
        }
      }));
}

export function enqueuePhoneCode(phoneNumber, code) {
  return requireSignedIn()
    .then(() => firebaseApp
      .database()
      .ref('events/tasks')
      .push()
      .set({
        owner: getUser().uid,
        type: 'verify-phone',
        timestamp: new Date().getTime(),
        payload: {
          phoneNumber,
          conde,
        }
      }));
}
