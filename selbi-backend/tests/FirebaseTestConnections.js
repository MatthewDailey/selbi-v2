import firebase from 'firebase';

const testUserData = require('./resources/testUser.json');
const minimalUserData = require('./resources/minimalUser.json');

const minimalUserListingOne = require('./resources/minimalUserListingOne.json');
const minimalUserListingTwo = require('./resources/minimalUserListingTwo.json');

const testUserListingOne = require('./resources/testUserListingOne.json');

class TestFirebaseConnections {
  constructor() {
    this.extraUserUid = 'AxoUrxRsXIZhHhdpyP0ejZi8MFE3';
    this.testUserUid = '3imZ3SbitbMUXL6Pt2FmVYCUtDo2';
    this.minimalUserUid = 'b7PJjQTFl8O2xRlYaohLD0AITb72';

    const testUserConfig = {
      serviceAccount: './selbi-staging-schema-test-service-account.json',
      databaseURL: 'https://selbi-staging.firebaseio.com',
      databaseAuthVariableOverride: {
        uid: this.testUserUid,
      },
    };

    this.testUserApp = firebase.initializeApp(testUserConfig, 'testUser');

    const minimalUserConfig = {
      serviceAccount: './selbi-staging-schema-test-service-account.json',
      databaseURL: 'https://selbi-staging.firebaseio.com',
      databaseAuthVariableOverride: {
        uid: this.minimalUserUid,
      },
    };
    this.minimalUserApp = firebase.initializeApp(minimalUserConfig, 'minimalUser');

    const serviceAccountConfig = {
      serviceAccount: './selbi-staging-schema-test-service-account.json',
      databaseURL: 'https://selbi-staging.firebaseio.com',
    };
    this.serviceAccountApp = firebase.initializeApp(serviceAccountConfig, 'serviceUser');
  }

  getMinimalUserData() {
    return JSON.parse(JSON.stringify(minimalUserData));
  }

  getTestUserData() {
    return JSON.parse(JSON.stringify(testUserData));
  }

  getTestUserListingOne() {
    return JSON.parse(JSON.stringify(testUserListingOne));
  }

  getMinimalUserListingOne() {
    return JSON.parse(JSON.stringify(minimalUserListingOne));
  }

  getMinimalUserListingTwo() {
    return JSON.parse(JSON.stringify(minimalUserListingTwo));
  }

  /*
   * Drop all data in the selbi-staging firebase db.
   *
   * @returns Promise which is fulfilled on successfully dropping or rejected with the error
   * which caused failure.
   */
  dropDatabase() {
    return this.serviceAccountApp
      .database()
      .ref('/')
      .remove();
  }
}

module.exports = new TestFirebaseConnections();
