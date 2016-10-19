import { expect } from 'chai';
import FirebaseTest, { minimalUserUid } from '../src/index';


describe('firebase test resources', () => {
  before(function (done) {
    this.timeout(6000);
    FirebaseTest
      .dropDatabase()
      .then(done)
      .catch(done);
  });

  it('can be imported', (done) => {
    FirebaseTest
      .createMinimalUser()
      .then(() => FirebaseTest
        .minimalUserApp
        .database()
        .ref('users')
        .child(minimalUserUid)
        .once('value'))
      .then((snapshot) => {
        expect(snapshot.exists()).to.equal(true);
      })
      .then(done)
      .catch(done);
  });

  it('can store whole test listing', (done) => {
    const testListingId = 'testListing';
    FirebaseTest.testUserApp.database()
      .ref('users')
      .child(FirebaseTest.testUserUid)
      .set(FirebaseTest.getMinimalUserData())
      .then(() => FirebaseTest.testUserApp.database()
        .ref('listings')
        .child(testListingId)
        .set(FirebaseTest.getTestUserListingOne()))
      .then(done)
      .catch(done);
  });
});
