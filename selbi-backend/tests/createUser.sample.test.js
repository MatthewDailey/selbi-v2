import { expect } from 'chai';
import FirebaseTest, { testUserUid } from '@selbi/firebase-test-resource';

/*
 * When a user authenticates we need to know if we have created that user in the db. This code
 * snippet demonstrates how to do that.
 *
 * @uid: The user id of the user we want to check if they exist.
 * @firebaseDb: We pass in the database in this sample test.
 *
 * @returns: A promise fulfulled with the user's data if the user exists, null otherwise.
 */
function checkIfUserExists(uid, firebaseDb) {
  return firebaseDb
    .ref('/users')
    .child(uid)
    .once('value')
    .then((snapshot) => Promise.resolve(snapshot.val()));
}

/*
 * When a user authenticates for the first time on their phone it will be anonymous. They will
 * automatically authenticate upon turning on the app.
 *
 * When we see the authStateChanged event for an anonymous user, we store a user object with their
 * uid to identify them.
 *
 * See https://firebase.google.com/docs/auth/web/anonymous-auth for anonymous auth.
 *
 * @uid: The user id of the anonymously authenticated user.
 * @firebaseDb: We pass in the database in this sample test.
 *
 * @returns: The promise which is fulfilled on successfully creating the user.
 */
function createAnonymousUser(uid, firebaseDb) {
  return firebaseDb
    .ref('/users')
    .child(uid)
    .set({
      userAgreementAccepted: false,
    });
}

/*
 * When a user provides more relevant information about themselves we will want to update it in the
 * db. This code snippet demonstrates how to update without deleting any existing data.
 *
 * @uid: The user id of the user we want to update.
 * @firebaseDb: We pass in the database in this sample test.
 *
 * @returns: A promise which is fulfilled with no args if successfully update.
 */
function updateUser(uid, firebaseDb) {
  return firebaseDb
    .ref('/users')
    .child(uid)
    .update({
      name: {
        first: 'Rand',
        last: 'El Thor',
      },
    });
}

describe('User Samples', () => {
  beforeEach(function (done) {
    this.timeout(6000);

    FirebaseTest
      .dropDatabase()
      .then(done)
      .catch(done);
  });

  it('check non-existant user', (done) => {
    checkIfUserExists(testUserUid, FirebaseTest.testUserApp.database())
      .then((result) => {
        expect(result).to.equal(null);
      })
      .then(done)
      .catch(done);
  });

  it('create anonymous user and check existance', (done) => {
    createAnonymousUser(testUserUid, FirebaseTest.testUserApp.database())
      .then(() => checkIfUserExists(testUserUid, FirebaseTest.testUserApp.database()))
      .then((userData) => {
        expect(userData.userAgreementAccepted).to.equal(false);
      })
      .then(done)
      .catch(done);
  });

  it('update user', (done) => {
    createAnonymousUser(testUserUid, FirebaseTest.testUserApp.database())
      .then(() => checkIfUserExists(testUserUid, FirebaseTest.testUserApp.database()))
      .then(() => updateUser(testUserUid, FirebaseTest.testUserApp.database()))
      .then(() => checkIfUserExists(testUserUid, FirebaseTest.testUserApp.database()))
      .then((userData) => {
        expect(userData.name.first).to.equal('Rand');
      })
      .then(done)
      .catch(done);
  });
});

