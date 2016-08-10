import { expect } from 'chai';
import FirebaseTest, { minimalUserUid } from './FirebaseTestConnections';

describe('/listings', () => {

  before(function (done) {
    this.timeout(6000);

    const createMinimalUser = () => FirebaseTest
        .minimalUserApp
        .database()
        .ref('/users')
        .child(minimalUserUid)
        .set(FirebaseTest.getMinimalUserData());

    FirebaseTest
      .dropDatabase()
      .then(createMinimalUser)
      .then(done)
      .catch(done);
  });

  it('is list', (done) => {
    const promiseStoreFirstListing = FirebaseTest
      .minimalUserApp
      .database()
      .ref('/listings')
      .child('listingOne')
      .set(FirebaseTest.getMinimalUserListingOne());
    const promiseStoreSecondListing = FirebaseTest
      .minimalUserApp
      .database()
      .ref('/listings')
      .child('listingTwo')
      .set(FirebaseTest.getMinimalUserListingTwo());

    const verifyThatBothListingsAreStored = () => {
      // Note we use the service account to read because we don't allow reading all listings.
      FirebaseTest
        .serviceAccountApp
        .database()
        .ref('/listings')
        .once('value')
        .then((snapshot) => {
          expect(Object.keys(snapshot.val()).length).to.equal(2);
          done();
        })
        .catch(done);
    };

    Promise.all([promiseStoreFirstListing, promiseStoreSecondListing])
      .then(verifyThatBothListingsAreStored)
      .catch(done);
  });

  it('user can only create own listings', (done) => {
    FirebaseTest
      .testUserApp
      .database()
      .ref('/listings')
      .child('shouldNotExist')
      .set(FirebaseTest.getMinimalUserListingOne())
      .then(() => {
        done(new Error('Should not be able to create listings for another user.'));
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
        done();
      });
  });

  it('can only create listings for existing user', (done) => {
    FirebaseTest
      .testUserApp
      .database()
      .ref('/listings')
      .child('shouldNotExist')
      .set(FirebaseTest.getTestUserListingOne())
      .then(() => {
        done(new Error('Should not be able to create listings for non-existant user.'));
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
        done();
      });
  });
});
