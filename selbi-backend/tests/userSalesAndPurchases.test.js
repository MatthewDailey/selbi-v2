import { expect } from 'chai';
import FirebaseTest, { testUserUid, minimalUserUid } from
  '@selbi/firebase-test-resource';

const testRecord = {
  sellerUid: testUserUid,
  buyerUid: minimalUserUid,
  timestamp: 1,
  status: 'in-progress',
};

const testListingId = 'test-listing-for-sale';

describe('/users/$uid/sales and /users/$uid/purchases', () => {
  beforeEach(function (done) {
    this.timeout(10000);
    const cleanMinimalUser = FirebaseTest
      .serviceAccountApp
      .database()
      .ref('users')
      .child(minimalUserUid)
      .remove();
    const cleanTestUser = FirebaseTest
      .serviceAccountApp
      .database()
      .ref('users')
      .child(testUserUid)
      .remove();

    Promise.all([cleanMinimalUser, cleanTestUser])
      .then(() => FirebaseTest.minimalUserApp
        .database()
        .ref('/users')
        .child(minimalUserUid)
        .set(FirebaseTest.getMinimalUserData()))
      .then(() => FirebaseTest.testUserApp
        .database()
        .ref('/users')
        .child(testUserUid)
        .set(FirebaseTest.getMinimalUserData()))
      .then(done)
      .catch(done);
  });

  it('can create purchase', (done) => {
    FirebaseTest
      .minimalUserApp
      .database()
      .ref('users')
      .child(minimalUserUid)
      .child('purchases')
      .child(testListingId)
      .set(testRecord)
      .then(done)
      .catch(done);
  });

  it('can create sale', (done) => {
    FirebaseTest
      .testUserApp
      .database()
      .ref('users')
      .child(testUserUid)
      .child('sales')
      .child(testListingId)
      .set(testRecord)
      .then(done)
      .catch(done);
  });
});