import firebase from 'firebase';

const testUserData = require('./resources/testUser.json');
const minimalUserData = require('./resources/minimalUser.json');

const minimalUserListingOne = require('./resources/minimalUserListingOne.json');
const minimalUserListingTwo = require('./resources/minimalUserListingTwo.json');

const testUserListingOne = require('./resources/testUserListingOne.json');

const partialUserListing = require('./resources/userListingsCompleteFromUser.json');
const completeUserListing = require('./resources/userListingsPartial.json');
const soldUserListing = require('./resources/userListingsComplete.json');

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

class TestFirebaseConnections {
  constructor() {
    this.extraUserUid = 'AxoUrxRsXIZhHhdpyP0ejZi8MFE3';
    this.testUserUid = '3imZ3SbitbMUXL6Pt2FmVYCUtDo2';
    this.minimalUserUid = 'b7PJjQTFl8O2xRlYaohLD0AITb72';

    const basicServiceAccountConfig = {
      serviceAccount: '../service-accounts/selbi-staging-service-account.json',
      databaseURL: 'https://selbi-staging.firebaseio.com',
    };

    const testUserConfig = deepCopy(basicServiceAccountConfig);
    testUserConfig.databaseAuthVariableOverride = {
      uid: this.testUserUid,
    };
    this.testUserApp = firebase.initializeApp(testUserConfig, 'testUser');

    const minimalUserConfig = deepCopy(basicServiceAccountConfig)
    minimalUserConfig.databaseAuthVariableOverride = {
      uid: this.minimalUserUid,
    };

    this.serviceAccountApp = firebase.initializeApp(basicServiceAccountConfig, 'serviceUser');
  }

  getMinimalUserData() {
    return deepCopy(minimalUserData);
  }

  getTestUserData() {
    return deepCopy(testUserData);
  }

  getTestUserListingOne() {
    return deepCopy(testUserListingOne);
  }

  getMinimalUserListingOne() {
    return deepCopy(minimalUserListingOne);
  }

  getMinimalUserListingTwo() {
    return deepCopy(minimalUserListingTwo);
  }

  getUserListingPartial() {
    return deepCopy(partialUserListing);
  }

  getUserListingCompleteForUser() {
    return deepCopy(completeUserListing);
  }

  getUserListingComplete() {
    return deepCopy(soldUserListing);
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
