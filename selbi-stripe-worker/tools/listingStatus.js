import ServiceAccount from '@selbi/service-accounts';
import firebase from 'firebase';
import GeoFire from 'geofire';

const firebaseApp = firebase.initializeApp(ServiceAccount.firebaseConfigFromEnvironment(),
  'serviceUser');

function changeListingStatus(newStatus, listingId, lat, lon) {
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
          .set(listingId, [lat, lon]));
      } else {
        allUpdatePromises.push(new GeoFire(firebaseApp.database().ref('/geolistings'))
          .remove(listingId));
      }

      return Promise.all(allUpdatePromises)
        .then(() => Promise.resolve(oldSnapshot));
    });
}

const listingId = process.argv[4];
const status = process.argv[5];
const lat = parseFloat(process.argv[6]);
const lon = parseFloat(process.argv[7]);

if (status !== 'sold' && status !== 'private' && status !== 'public' && status !== 'inactive') {
  throw new Error('Invalid status');
}

if (status === 'public' && (!lat || !lon)) {
  throw new Error('To make a listing public, you must include lat and lon args');
}

changeListingStatus(status, listingId, lat, lon)
  .then(() => {
    console.log('Successfully changed listing status.');
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
