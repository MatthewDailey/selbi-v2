import firebase from 'firebase';
import rc from 'rc';

const testUserData = require('../resources/testUser.json');
const minimalUserData = require('../resources/minimalUser.json');

const minimalUserListingOne = require('../resources/minimalUserListingOne.json');
const minimalUserListingTwo = require('../resources/minimalUserListingTwo.json');

const testUserListingOne = require('../resources/testUserListingOne.json');

const partialUserListing = require('../resources/userListingsCompleteFromUser.json');
const completeUserListing = require('../resources/userListingsPartial.json');
const soldUserListing = require('../resources/userListingsComplete.json');

export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function getLocalConfig() {
  const rcFilePath = process.env.SELBI_CONFIG_FILE ? process.env.SELBI_CONFIG_FILE : 'selbi';
  return rc(rcFilePath, {});
}

export const extraUserUid = 'AxoUrxRsXIZhHhdpyP0ejZi8MFE3';
export const testUserUid = '3imZ3SbitbMUXL6Pt2FmVYCUtDo2';
export const minimalUserUid = 'b7PJjQTFl8O2xRlYaohLD0AITb72';

class TestFirebaseConnections {
  constructor() {
    let basicServiceAccountConfig = {
      serviceAccount: '../service-accounts/selbi-develop-service-account.json',
      databaseURL: 'https://selbi-develop.firebaseio.com',
    };

    const localSelbiConfig = getLocalConfig();
    if (!!localSelbiConfig.firebaseServiceAccount && !!localSelbiConfig.firebasePublicConfig) {
      basicServiceAccountConfig = {
        serviceAccount: localSelbiConfig.firebaseServiceAccount,
        databaseURL: localSelbiConfig.firebasePublicConfig.databaseURL,
      };
    } else {
      console.warn('Tests are running against develop!');
    }

    const testUserConfig = deepCopy(basicServiceAccountConfig);
    testUserConfig.databaseAuthVariableOverride = {
      uid: testUserUid,
    };
    this.testUserApp = firebase.initializeApp(testUserConfig, 'testUser');

    const minimalUserConfig = deepCopy(basicServiceAccountConfig);
    minimalUserConfig.databaseAuthVariableOverride = {
      uid: minimalUserUid,
    };
    this.minimalUserApp = firebase.initializeApp(minimalUserConfig, 'minimalUser');

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

  createMinimalUser() {
    return this.minimalUserApp
      .database()
      .ref('/users')
      .child(minimalUserUid)
      .set(this.getMinimalUserData());
  }
}

export default new TestFirebaseConnections();

export function expectUnableToStore(firebaseStorePromise) {
  return firebaseStorePromise
    .then(() => {
      throw new Error('Should not be able to store.');
    })
    .catch((error) => {
      if (!('code' in error) || error.code !== 'PERMISSION_DENIED') {
        throw error;
      }
    });
}

