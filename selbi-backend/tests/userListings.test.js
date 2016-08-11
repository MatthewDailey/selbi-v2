import { expect } from 'chai';
import FirebaseTest, { testUserUid, minimalUserUid, extraUserUid } from './FirebaseTestConnections';

describe('/userListings', () => {
  before(function (done) {
    this.timeout(6000);

    const createMinimalUser = () => FirebaseTest
      .minimalUserApp
      .database()
      .ref('/users')
      .child(minimalUserUid)
      .set(FirebaseTest.getMinimalUserData());

    const createTestUser = () => FirebaseTest
      .testUserApp
      .database()
      .ref('/users')
      .child(testUserUid)
      .set(FirebaseTest.getTestUserData());

    FirebaseTest
      .dropDatabase()
      .then(createTestUser)
      .then(createMinimalUser)
      .then(done)
      .catch(done);
  });

  // Verify that users can create basic listings and service account can create sold + salePending.
  it('is list', (done) => {
    const promiseStoreCompleteUserListing = FirebaseTest
      .minimalUserApp
      .database()
      .ref('/userListings')
      .child(minimalUserUid)
      .set(FirebaseTest.getUserListingComplete());

    const promiseStorePartialUserListing = FirebaseTest
      .testUserApp
      .database()
      .ref('/userListings')
      .child(testUserUid)
      .set(FirebaseTest.getUserListingPartial());

    const promiseStoreUserListingSold = FirebaseTest
      .serviceAccountApp
      .database()
      .ref('/userListings')
      .child(extraUserUid)
      .set(FirebaseTest.getUserListingSoldAndSalePending());

    Promise.all([promiseStoreCompleteUserListing,
        promiseStorePartialUserListing,
        promiseStoreUserListingSold])
      .then(() => {
        FirebaseTest
          .serviceAccountApp
          .database()
          .ref('/userListings')
          .once('value')
          .then((snapshot) => {
            expect(Object.keys(snapshot.val()).length).to.equal(3);
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
});
