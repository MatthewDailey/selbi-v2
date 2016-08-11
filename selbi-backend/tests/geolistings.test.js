import { expect } from 'chai';
import GeoFire from 'geofire';
import FirebaseTest, { testUserUid } from './FirebaseTestConnections';

function createTestUserListingWithId(listindId) {
  return FirebaseTest
    .testUserApp
    .database()
    .ref('/listings')
    .child(listindId)
    .set(FirebaseTest.getTestUserListingOne());
}

function testUserGeoFireRef() {
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
    testUserGeoFireRef()
      .set('nonExistantListingId', [37.79, -122.41])
      .then(() => {
        done(new Error('Should not be able to store a geolisting for non-existant listing.'));
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
        done();
      });
  });

  it('cannot create arbitrary data on geolistings', (done) => {
    FirebaseTest
      .testUserApp
      .database()
      .ref('/geolistings')
      .child('newChild')
      .set('somedata')
      .then(() => {
        done(new Error('Should not be able to store arbitrary data in geolisting.'));
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
        done();
      });
  });

  it('cannot store geolisting for other user', (done) => {
    const listingId = 'minimalUserListing';
    FirebaseTest
      .minimalUserApp
      .database()
      .ref('/listings')
      .child(listingId)
      .set(FirebaseTest.getMinimalUserListingOne())
      .then(() => testUserGeoFireRef().set('newListingId', [37.79, -122.41]))
      .then(() => {
        done(new Error('Should not be able to store geolisting for different users listing.'));
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
        done();
      });
  });

  it('can create geolisting for listing', (done) => {
    createTestUserListingWithId('newListingId')
      .then(() => testUserGeoFireRef().set('newListingId', [37.79, -122.41]))
      .then(done)
      .catch(done);
  });

  it('can query geolistings', (done) => {
    const listingId = 'newListingId';
    createTestUserListingWithId(listingId)
      .then(() => testUserGeoFireRef().set(listingId, [37.79, -122.41]))
      .then(() => {
        const geoQuery = testUserGeoFireRef().query({
          center: [37.79, -122.41],
          radius: 10.5,
        });
        geoQuery.on('key_entered', (data) => {
          expect(data).to.equal(listingId);
        });
        geoQuery.on('key_exited', () => {
          done(new Error('Unexpected call to key_exited on geo query.'));
        });
        geoQuery.on('key_moved', () => {
          done(new Error('Unexpected call to key_moved on geo query.'));
        });
        geoQuery.on('ready', () => {
          geoQuery.cancel();
          done();
        });
      })
      .catch(done);
  });

  it('query only finds proximate listings', (done) => {
    const listingId = 'newListingId';
    createTestUserListingWithId(listingId)
      .then(() => testUserGeoFireRef().set(listingId, [37.79, 122.41]))
      .then(() => {
        const geoQuery = testUserGeoFireRef().query({
          center: [37.79, -122.41],
          radius: 10.5,
        });
        geoQuery.on('key_entered', () => {
          done(new Error('Unexpected call to key_entered on geo query.'));
        });
        geoQuery.on('key_exited', () => {
          done(new Error('Unexpected call to key_exited on geo query.'));
        });
        geoQuery.on('key_moved', () => {
          done(new Error('Unexpected call to key_moved on geo query.'));
        });
        geoQuery.on('ready', () => {
          geoQuery.cancel();
          done();
        });
      })
      .catch(done);
  });
});
