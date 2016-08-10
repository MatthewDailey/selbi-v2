import firebase from 'firebase';
import { expect } from 'chai';

const minimalUserData = require('./resources/minimalUser.json');

const minimalUserUid = 'b7PJjQTFl8O2xRlYaohLD0AITb72';
const minimalUserConfig = {
  serviceAccount: './selbi-staging-schema-test-service-account.json',
  databaseURL: 'https://selbi-staging.firebaseio.com',
  databaseAuthVariableOverride: {
    uid: minimalUserUid,
  },
};
const minimalUserFirebaseApp = firebase.initializeApp(minimalUserConfig, 'minimalUser');

const serviceAccountConfig = {
  serviceAccount: './selbi-staging-schema-test-service-account.json',
  databaseURL: 'https://selbi-staging.firebaseio.com',
};
const serviceAccountFirebaseApp = firebase.initializeApp(serviceAccountConfig, 'serviceUser');

describe('listings', () => {

  before(function (done) {
    this.timeout(6000);

    serviceAccountFirebaseApp
      .database()
      .ref('/users')
      .remove()
      .then(done)
      .catch(done);
  });

  describe('/users/$uid/listing', () => {
    const usersRef = minimalUserFirebaseApp.database().ref('/users/');

    it('accepts complete listings objects', (done) => {
      const modifiedMinimalUserData = JSON.parse(JSON.stringify(minimalUserData));
      modifiedMinimalUserData.listings = {
        private: { l1: true },
        public: { l1: true },
        inactive: { l2: true },
        sold: { l3: true },
        salePending: { l4: true },
      };
      usersRef
        .child(minimalUserUid)
        .set(modifiedMinimalUserData)
        .then(done)
        .catch(done);
    });

    it('accepts empty listings objects', (done) => {
      // This test passes because Firebase ignores empty objects.
      const modifiedMinimalUserData = JSON.parse(JSON.stringify(minimalUserData));
      modifiedMinimalUserData.listings = {};
      usersRef
        .child(minimalUserUid)
        .set(modifiedMinimalUserData)
        .then(done)
        .catch(done);
    });
  });
});
