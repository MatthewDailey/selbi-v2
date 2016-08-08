import firebase from 'firebase';

const testUserData = require('./resources/testUser.json');

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

const serviceAccountConfig = {
  serviceAccount: './selbi-staging-schema-test-service-account.json',
  databaseURL: 'https://selbi-staging.firebaseio.com',
};
const serviceAccountFirebaseApp = firebase.initializeApp(serviceAccountConfig, 'serviceUser');

describe('/users', () => {
  function getCreateFakeUsersFunction(done) {
    return () => {
      const usersRef = serviceAccountFirebaseApp
        .database()
        .ref('/users');

      const createTestUserPromise = usersRef
        .child(testUserUid)
        .set(testUserData);

      const createFakeUserPromise = usersRef
        .child('secondFakeUser')
        .set(testUserData);

      Promise.all([createFakeUserPromise, createTestUserPromise])
        .then(() => {
          done();
        })
        .catch(done);
    };
  }

  /*
   * Delete all existing /users data and create 2 new users. Timeout is increased for this query.
   *
   * Note that we use function() syntax instead of lexical arrow syntax because Mocha does not
   * work with lexical arrows.
   */
  before(function (done) {
    this.timeout(6000);

    serviceAccountFirebaseApp
      .database()
      .ref('/users')
      .remove()
      .then(getCreateFakeUsersFunction(done))
      .catch(done);
  });

  it('is a list', () => {
    throw new Error('TODO');
  });

  describe('as schemaTestUser', () => {
    it('Can read own data.', () => {
      throw new Error('TODO');
    });

    it('Can write own data.', () => {
      throw new Error('TODO');
    });

    it('Cannot read other\'s data.', () => {
      throw new Error('TODO');
    });

    it('Cannot write other\'s data.', () => {
      throw new Error('TODO');
    });
  });

  describe('as serviceUser', () => {
    it('Can read user data.', () => {
      throw new Error('TODO');
    });

    it('Can write user data.', () => {
      throw new Error('TODO');
    });
  });

  describe('user fields', () => {
    describe('name', () => {
      it('first', () => {
        throw new Error('TODO');
      });

      it('last', () => {
        throw new Error('TODO');
      });
    });

    it('email', () => {
      throw new Error('TODO');
    });

    it('profileImageUrl', () => {
      throw new Error('TODO');
    });

    it('dateOfBirth', () => {
      throw new Error('TODO');
    });

    it('phoneNumber', () => {
      throw new Error('TODO');
    });

    it('userAgreementAccepted', () => {
      throw new Error('TODO');
    });

    describe('locations', () => {
      describe('sellingFrom', () => {
        it('address1', () => {
          throw new Error('TODO');
        });

        it('address2', () => {
          throw new Error('TODO');
        });

        it('city', () => {
          throw new Error('TODO');
        });

        it('state', () => {
          throw new Error('TODO');
        });

        it('zip', () => {
          throw new Error('TODO');
        });

        it('country', () => {
          throw new Error('TODO');
        });
      });

      describe('shipTo', () => {
        it('address1', () => {
          throw new Error('TODO');
        });

        it('address2', () => {
          throw new Error('TODO');
        });

        it('city', () => {
          throw new Error('TODO');
        });

        it('state', () => {
          throw new Error('TODO');
        });

        it('zip', () => {
          throw new Error('TODO');
        });

        it('country', () => {
          throw new Error('TODO');
        });
      });
    });

    describe('listings', () => {
      it('all', () => {
        throw new Error('TODO');
      });

      it('active', () => {
        throw new Error('TODO');
      });

      it('paused', () => {
        throw new Error('TODO');
      });

      it('soldListings', () => {
        throw new Error('TODO');
      });
    });

    it('friends', () => {
      throw new Error('TODO');
    });

    describe('payments', () => {
      it('is a list', () => {
        throw new Error('TODO');
      });

      describe('payment fields', () => {
        it('stripeCustomerId', () => {
          throw new Error('TODO');
        });

        it('stripeCardId', () => {
          throw new Error('TODO');
        });

        it('cardType', () => {
          throw new Error('TODO');
        });

        it('lastFour', () => {
          throw new Error('TODO');
        });

        it('expirationDate', () => {
          throw new Error('TODO');
        });
      });
    });

    describe('merchant', () => {
      it('accountNumberLast4', () => {
        throw new Error('TODO');
      });

      it('routingNumber', () => {
        throw new Error('TODO');
      });

      it('publicKey', () => {
        throw new Error('TODO');
      });

      it('secretKey', () => {
        throw new Error('TODO');
      });

      it('stripeBankId', () => {
        throw new Error('TODO');
      });

      it('stripeManagedAccountId', () => {
        throw new Error('TODO');
      });

      it('stripeVerified', () => {
        throw new Error('TODO');
      });
    });
  });
});
