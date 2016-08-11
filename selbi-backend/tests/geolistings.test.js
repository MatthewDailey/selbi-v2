import { expect } from 'chai';
import GeoFire from 'geofire';
import FirebaseTest, { testUserUid } from './FirebaseTestConnections';

function createListingWithId(listindId) {
  return FirebaseTest
    .testUserApp
    .database()
    .ref('/listings')
    .child(listindId)
    .set(FirebaseTest.getTestUserListingOne());
}

function geoFireRef() {
  const geolistingsRef = FirebaseTest
    .testUserApp
    .database()
    .ref('/geolistings');

  return new GeoFire(geolistingsRef);
}

describe('/geolistings', () => {
  before(function (done) {
    this.timeout(6000);

    const createTestUser = () => FirebaseTest
      .testUserApp
      .database()
      .ref('/users')
      .child(testUserUid)
      .set(FirebaseTest.getMinimalUserData());

    FirebaseTest
      .dropDatabase()
      .then(createTestUser)
      .then(done)
      .catch(done);
  });

  it('cannot create geolisting without listing', (done) => {
    geoFireRef()
      .set('nonExistantListingId', [37.79, -122.41])
      .then(() => {
        done(new Error('Should not be able to store a geolisting for non-existant listing.'))
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
        done();
      });
  });

  it('can create geolisting for listing', (done) => {
    createListingWithId('newListingId')
      .then(() => geoFireRef().set('newListingId', [37.79, -122.41]))
      .then(done)
      .catch(done);
  });

  // it('create GeoFire index', (done) => {
  //
  //
  //   const logResult = (data) => console.log(data)
  //
  //   const promiseKey1 = geoFire.set('key1', ).then(logResult);
  //   const promiseKey2 = geoFire.set('key2', [37.79, -122.41]).then(logResult);
  //   const promiseKey3 = geoFire.set('key3', [37.79, 122.41]).then(logResult);
  //
  //   Promise.all([promiseKey1, promiseKey2, promiseKey3])
  //     .then(() => {
  //       const geoQuery = geoFire.query({
  //         center: [37.79, -122.41],
  //         radius: 10.5,
  //       });
  //       geoQuery.on('ready', () => console.log('ready'));
  //       geoQuery.on('key_entered', (data) => console.log(`entered: ${data}`));
  //       geoQuery.on('key_exited', (data) => console.log(`exited: ${data}`));
  //       geoQuery.on('key_moved', (data) => console.log(`moved: ${data}`));
  //     });
  // });
});
