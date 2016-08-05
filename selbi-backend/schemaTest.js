import firebase from 'firebase';

/*
 * Note that to authenticate server size, we use the explicit userId. In this manner we can
 * simulate multiple users at various auth stages.
 *
 * Service users are created from the Settings -> Permissions path in the Firebase console.
 *
 * To behave as a public user, we simply remove the service account and
 * databaseAuthVariableOverride.
 */
const schemaTestUserUid = '3imZ3SbitbMUXL6Pt2FmVYCUtDo2';
const config = {
  serviceAccount: './selbi-staging-schema-test-service-account.json',
  databaseURL: 'https://selbi-staging.firebaseio.com',
  databaseAuthVariableOverride: {
    uid: schemaTestUserUid,
  },
};
const firebaseApp = firebase.initializeApp(config);

firebaseApp.database()
  .ref('users/firstuseruid')
  .once('value',
    (snapshot) => {
      console.log('SUCCESS');
      console.log(snapshot.val());
    },
    (error) => {
      console.log('FAIL');
      console.log(error);
    });

