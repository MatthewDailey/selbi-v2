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
  databaseURL: 'https://selbi-staging.firebaseio.com',
};
const serviceAccountFirebaseApp = firebase.initializeApp(serviceAcccountConfig, 'serviceUser');


describe('/users', () => {
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

    it('profileImage', () => {
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
      it('sellingFrom', () => {
        throw new Error('TODO');
      });

      it('shipTo', () => {
        throw new Error('TODO');
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
