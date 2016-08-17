import { expect } from 'chai';
import FirebaseTest, { testUserUid, minimalUserUid, extraUserUid } from
  '@selbi/firebase-test-resource';

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
      .set(FirebaseTest.getUserListingCompleteForUser());

    const promiseStorePartialUserListing = FirebaseTest
      .testUserApp
      .database()
      .ref('/userListings')
      .child(testUserUid)
      .set(FirebaseTest.getUserListingPartial());

    // Use service account to store userLIsting because normal users can't modify sold+salePending.
    const promiseStoreUserListingSold = FirebaseTest
      .serviceAccountApp
      .database()
      .ref('/userListings')
      .child(extraUserUid)
      .set(FirebaseTest.getUserListingComplete());

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

  it('user cannot write entire userListing with sold or salePending', (done) => {
    FirebaseTest
      .minimalUserApp
      .database()
      .ref('/userListings')
      .child(minimalUserUid)
      .set(FirebaseTest.getUserListingComplete())
      .then(() => {
        done(new Error('Should not be able to write to salePending or sold'));
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
        done();
      });
  });

  function testUserCannotWriteOwn(userListingType) {
    it(`user cannot write to /userListings/$uid/${userListingType}`, (done) => {
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('/userListings')
        .child(minimalUserUid)
        .child(userListingType)
        .update({
          listingOne: true,
        })
        .then(() => {
          done(new Error(`Should not be able to update /userListings/$uid/${userListingType}`));
        })
        .catch((error) => {
          expect(error.code).to.equal('PERMISSION_DENIED');
          done();
        });
    });
  }

  function testUserCanWriteOwn(userListingType) {
    it(`user can write to /userListings/$uid/${userListingType}`, (done) => {
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('/userListings')
        .child(minimalUserUid)
        .child(userListingType)
        .update({
          listingOne: true,
        })
        .then(done)
        .catch(done);
    });
  }

  function testUserCanReadOwn(userListingType) {
    it(`user can read /userListings/$uid/${userListingType}`, (done) => {
      const verifyThatUserListingTypePresent = () => FirebaseTest
        .minimalUserApp
        .database()
        .ref('/userListings')
        .child(minimalUserUid)
        .child(userListingType)
        .once('value')
        .then((snapshot) => {
          expect(snapshot.exists()).to.equal(true);
          done();
        })
        .catch(done);

      //
      FirebaseTest
        .serviceAccountApp
        .database()
        .ref('/userListings')
        .child(minimalUserUid)
        .child(userListingType)
        .update({
          listingOne: true,
        })
        .then(verifyThatUserListingTypePresent)
        .catch(done);
    });
  }

  testUserCanWriteOwn('inactive');
  testUserCanWriteOwn('private');
  testUserCanWriteOwn('public');

  testUserCannotWriteOwn('sold');
  testUserCannotWriteOwn('salePending');

  testUserCanReadOwn('inactive');
  testUserCanReadOwn('private');
  testUserCanReadOwn('public');
  testUserCanReadOwn('sold');
  testUserCanReadOwn('salePending');
});
