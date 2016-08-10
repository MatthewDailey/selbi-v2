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
});
