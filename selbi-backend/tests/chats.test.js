import FirebaseTest, { minimalUserUid, testUserUid, expectUnableToStore}
  from '@selbi/firebase-test-resource';

const testListingId = 'testListing';


// The data should be shapped like this:
// {
//   selling: {
//     $listingId: {
//       $buyerId : true
//     }
//   },
//   buying: {
//     $listingId: true
//   }
// }
//
// Chats are initiated by a buyer so can only be created by a buyer but read by

describe('/chats', () => {
  before(function (done) {
    this.timeout(6000);
    FirebaseTest
      .dropDatabase()
      .then(done)
      .catch(done);
  });

  it('can store buying pointer as buyer', (done) => {
    FirebaseTest
      .minimalUserApp
      .database()
      .ref('chats')
      .child(minimalUserUid)
      .child('buying')
      .child(testListingId)
      .set(true)
      .then(done)
      .catch(done);
  });

  it('can store selling pointer as buyer', (done) => {
    FirebaseTest
      .minimalUserApp
      .database()
      .ref('chats')
      .child(testUserUid)
      .child('selling')
      .child(testListingId)
      .child(minimalUserUid)
      .set(true)
      .then(done)
      .catch(done);
  });

  it('cannot store selling pointer as seller', (done) => {
    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('chats')
        .child(minimalUserUid)
        .child('selling')
        .child(testListingId)
        .child(testUserUid)
        .set(true))
      .then(done)
      .catch(done);
  });

  it('cannot store buying pointer as seller', (done) => {
    expectUnableToStore(
      FirebaseTest
        .testUserApp
        .database()
        .ref('chats')
        .child(minimalUserUid)
        .child('buying')
        .child(testListingId)
        .set(true))
      .then(done)
      .catch(done);
  });

  it('cannot write directly to /chats', (done) => {
    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('chats')
        .set('some data'))
      .then(done)
      .catch(done);
  });

  it('cannot write directly to /chats/$uid', (done) => {
    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('chats')
        .child(minimalUserUid)
        .set('some data'))
      .then(done)
      .catch(done);
  });

  it('cannot write directly to /chats/$uid/selling', (done) => {
    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('chats')
        .child(minimalUserUid)
        .child('selling')
        .set('some data'))
      .then(done)
      .catch(done);
  });

  it('cannot write directly to /chats/$uid/buying', (done) => {
    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('chats')
        .child(minimalUserUid)
        .child('buying')
        .set('some data'))
      .then(done)
      .catch(done);
  });
});
