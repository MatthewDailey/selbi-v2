import firebase from 'firebase';

/*
 * This suite tests the /users endpoint for loading user data.
 */

const testUserUid = '3imZ3SbitbMUXL6Pt2FmVYCUtDo2';
const testUserConfig = {
  serviceAccount: './selbi-staging-schema-test-service-account.json',
  databaseURL: 'https://selbi-staging.firebaseio.com',
  databaseAuthVariableOverride: {
    uid: testUserUid,
  },
};
const testUserFirebaseApp = firebase.initializeApp(testUserConfig, 'testUser');

const serviceAcccountConfig = {
  serviceAccount: './selbi-staging-schema-test-service-account.json',
  databaseURL: 'https://selbi-staging.firebaseio.com'
};
const serviceAccountFirebaseApp = firebase.initializeApp(serviceAcccountConfig, 'serviceUser');

describe('/users', () => {
  describe('as schemaTestUser', () => {
    it('Passes!', () => {
      // Ta-da!
    });
  });
});
