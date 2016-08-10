import firebase from 'firebase';
import { expect } from 'chai';

/*
 * In this test we use 4 different users to probe the schema requirements and demonstrate how
 * to craft certain queries.
 *
 * The users are:
 * - testUser: generic user.
 * - minimalUser: user with the minimal acceptable data.
 * - extraUser: second generic user that test user can try to interact with.
 * - serviceUser: user simulating a backend server interacting with firebase.
 *
 */

const testUserData = require('./resources/testUser.json');
const minimalUserData = require('./resources/minimalUser.json');

const extraUserUid = 'AxoUrxRsXIZhHhdpyP0ejZi8MFE3';
const testUserUid = '3imZ3SbitbMUXL6Pt2FmVYCUtDo2';
const minimalUserUid = 'b7PJjQTFl8O2xRlYaohLD0AITb72';

const testUserConfig = {
  serviceAccount: './selbi-staging-schema-test-service-account.json',
  databaseURL: 'https://selbi-staging.firebaseio.com',
  databaseAuthVariableOverride: {
    uid: testUserUid,
  },
};
const testUserFirebaseApp = firebase.initializeApp(testUserConfig, 'testUser');

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
        .child(extraUserUid)
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

  it('user no extra params', (done) => {
    const testUserDataWithExtra = JSON.parse(JSON.stringify(testUserData));
    testUserDataWithExtra.extra = 'extraProp';
    testUserFirebaseApp
      .database()
      .ref('/users')
      .child(testUserUid)
      .set(testUserDataWithExtra)
      .then(() => {
        done(new Error('Should not be able to store user data with extra property.'));
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
        done();
      });
  });

  it('is a list', (done) => {
    serviceAccountFirebaseApp
      .database()
      .ref('/users')
      .once('value')
      .then((snapshot) => {
        expect(Object.keys(snapshot.val()).length).to.equal(2);
        done();
      })
      .catch(done);
  });

  describe('minimal user', () => {
    const usersRef = minimalUserFirebaseApp
      .database()
      .ref('/users');

    it('accepts minimal user', (done) => {
      usersRef
        .child(minimalUserUid)
        .set(minimalUserData)
        .then(done)
        .catch(done);
    });

    function testMinimalDataWithoutField(fieldToDelete, done) {
      const minimalDataWithDeletedField = Object.assign({}, minimalUserData);
      delete minimalDataWithDeletedField[fieldToDelete];

      usersRef
        .child(minimalUserUid)
        .set(minimalDataWithDeletedField)
        .then(() => {
          done(new Error('Should not be able to store user data without name.'));
        })
        .catch((error) => {
          expect(error.code).to.equal('PERMISSION_DENIED');
          done();
        });
    }

    it('requires name', (done) => {
      testMinimalDataWithoutField('name', done);
    });

    it('requires email', (done) => {
      testMinimalDataWithoutField('email', done);
    });

    it('requires userAgreementAccepted', (done) => {
      testMinimalDataWithoutField('userAgreementAccepted', done);
    });
  });

  describe('as schemaTestUser', () => {
    const usersRef = testUserFirebaseApp.database().ref('/users');

    it('Can read own data.', (done) => {
      usersRef
        .child(testUserUid)
        .once('value')
        .then((snapshot) => {
          expect(snapshot.val().email).to.equal('test@selbi.io');
          done();
        })
        .catch(done);
    });

    it('Can write own data.', (done) => {
      usersRef
        .child(testUserUid)
        .child('email')
        .set('test@selbi.io')
        .then(done)
        .catch(done);
    });

    it('Cannot read other\'s data.', (done) => {
      usersRef
        .child(extraUserUid)
        .once('value')
        .then(() => {
          done(new Error('Should not be able to read other users data.'));
        })
        .catch((error) => {
          expect(error.code).to.equal('PERMISSION_DENIED');
          done();
        });
    });

    it('Cannot write other\'s data.', (done) => {
      usersRef
        .child(extraUserUid)
        .child('email')
        .set('test@selbi.io')
        .then(() => {
          done(new Error('Should not be able to write other users data.'));
        })
        .catch((error) => {
          expect(error.code).to.equal('PERMISSION_DENIED');
          done();
        });
    });
  });

  describe('as serviceUser', () => {
    const usersRef = serviceAccountFirebaseApp.database().ref('/users');

    it('Can read user data.', (done) => {
      const readTestUserPromise = usersRef
        .child(testUserUid)
        .once('value')
        .then((snapshot) => {
          expect(snapshot.val().email).to.equal('test@selbi.io');
        });

      const readExtraUserPromise = usersRef
        .child(extraUserUid)
        .once('value')
        .then((snapshot) => {
          expect(snapshot.val().email).to.equal('test@selbi.io');
        });

      Promise.all([readExtraUserPromise, readTestUserPromise])
        .then(() => {
          done();
        })
        .catch(done);
    });

    it('Can write user data.', (done) => {
      const writeTestUserPromise = usersRef
        .child(testUserUid)
        .child('email')
        .set('test@selbi.io');
      const writeExtraUserPromise = usersRef
        .child(extraUserUid)
        .child('email')
        .set('test@selbi.io');

      Promise.all([writeExtraUserPromise, writeTestUserPromise])
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  // This suite works by modifying the minimal data to add fields and verify that they pass the
  // schema checks.
  describe('user fields', () => {
    const usersRef = minimalUserFirebaseApp
      .database()
      .ref('/users');

    function setPropertyAndExpectSuccessfulStore(objectModification, done) {
      const minimalUserDataCopy = JSON.parse(JSON.stringify(minimalUserData));
      objectModification(minimalUserDataCopy);
      usersRef
        .child(minimalUserUid)
        .set(minimalUserDataCopy)
        .then(done)
        .catch(done);
    }

    function setPropertyAndExpectPermissionDenied(objectModification, done) {
      const minimalUserDataCopy = JSON.parse(JSON.stringify(minimalUserData));
      objectModification(minimalUserDataCopy)
      usersRef
        .child(minimalUserUid)
        .set(minimalUserDataCopy)
        .then(() => {
          done(new Error('Should not be able to store data.'));
        })
        .catch((error) => {
          expect(error.code).to.equal('PERMISSION_DENIED');
          done();
        });
    }

    describe('userAgreementAccepted', () => {
      it('is boolean', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            // noinspection Eslint
            data.userAgreementAccepted = 1;
          }, done);
      });
    });

    describe('name', () => {
      it('takes no extra parameters', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            // noinspection Eslint
            data.name.extra = "extraParam";
          }, done);
      });

      describe('first', () => {
        it('is required', (done) => {
          setPropertyAndExpectPermissionDenied(
            (data) => {
              // noinspection Eslint
              delete data.name.first;
            }, done);
        });

        it('is string', (done) => {
          setPropertyAndExpectPermissionDenied(
            (data) => {
              // noinspection Eslint
              data.name.first = 1;
            }, done);
        });
      });

      describe('last', () => {
        it('is required', (done) => {
          setPropertyAndExpectPermissionDenied(
            (data) => {
              // noinspection Eslint
              delete data.name.last;
            }, done);
        });

        it('is string', (done) => {
          setPropertyAndExpectPermissionDenied(
            (data) => {
              // noinspection Eslint
              data.name.last = 1;
            }, done);
        });
      });
    });

    it('email is string', (done) => {
      setPropertyAndExpectPermissionDenied(
        (data) => {
          // noinspection Eslint
          data.email = 1;
        }, done);
    });

    describe('profileImageUrl', () => {
      it('cannot be non-string', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            // noinspection Eslint
            data.profileImageUrl = 1;
          }, done);
      });

      it('cannot be non-url string', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            // noinspection Eslint
            data.profileImageUrl = "not a url";
          }, done);
      });

      it('may begin with http://', (done) => {
        setPropertyAndExpectSuccessfulStore(
          (data) => {
            // noinspection Eslint
            data.profileImageUrl = 'http://cooldomain';
          }, done);
      });

      it('may begin with https://', (done) => {
        setPropertyAndExpectSuccessfulStore(
          (data) => {
            // noinspection Eslint
            data.profileImageUrl = 'https://cooldomain';
          }, done);
      });
    });

    describe('dateOfBirth', () => {
      it('is a string', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            // noinspection Eslint
            data.dateOfBirth = 1;
          }, done);
      });

      it('doesnt match differing formats', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            // noinspection Eslint
            data.dateOfBirth = 'March 20 1990';
          }, done);
      });

      it('matches format 1990-03-20', (done) => {
        setPropertyAndExpectSuccessfulStore(
          (data) => {
            // noinspection Eslint
            data.dateOfBirth = '1990-03-20';
          }, done);
      });
    });

    describe('phoneNumber', () => {
      it('is an integer', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            // noinspection Eslint
            data.phoneNumber = "a string";
          }, done);
      });

      it('cannot have other than 10 digit', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            // noinspection Eslint
            data.phoneNumber = 12;
          }, done);
      });

      it('has 10 digit', (done) => {
        setPropertyAndExpectSuccessfulStore(
          (data) => {
            // noinspection Eslint
            data.phoneNumber = 1234567890;
          }, done);
      });
    });

    describe('userAgreementAccepted', () => {
      it('is required', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            // noinspection Eslint
            delete data.userAgreementAccepted;
          }, done);
      });
    });

    describe('locations', () => {
      function testAddress(addressType) {
        const simpleAddressData = {
          address1: 'first address',
          address2: 'second address',
          city: 'san francisco',
          state: 'california',
          zip: 95100,
          country: 'usa' };

        it('successful store', (done) => {
          setPropertyAndExpectSuccessfulStore(
            (data) => {
              // noinspection Eslint
              data.locations = {};
              // noinspection Eslint
              data.locations[addressType] = simpleAddressData;
            }, done);
        });

        it('requires address1', (done) => {
          setPropertyAndExpectPermissionDenied(
            (data) => {
              const modifiedAddress = Object.assign({}, simpleAddressData);
              delete modifiedAddress.address1;
              // noinspection Eslint
              data.locations = {};
              // noinspection Eslint
              data.locations[addressType] = modifiedAddress;
            }, done);
        });

        it('requires address2', (done) => {
          setPropertyAndExpectPermissionDenied(
            (data) => {
              const modifiedAddress = Object.assign({}, simpleAddressData);
              delete modifiedAddress.address2;
              // noinspection Eslint
              data.locations = {};
              // noinspection Eslint
              data.locations[addressType] = modifiedAddress;
            }, done);
        });

        it('requires city', (done) => {
          setPropertyAndExpectPermissionDenied(
            (data) => {
              const modifiedAddress = Object.assign({}, simpleAddressData);
              delete modifiedAddress.city;
              // noinspection Eslint
              data.locations = {};
              // noinspection Eslint
              data.locations[addressType] = modifiedAddress;
            }, done);
        });

        it('requires state', (done) => {
          setPropertyAndExpectPermissionDenied(
            (data) => {
              const modifiedAddress = Object.assign({}, simpleAddressData);
              delete modifiedAddress.state;
              // noinspection Eslint
              data.locations = {};
              // noinspection Eslint
              data.locations[addressType] = modifiedAddress;
            }, done);
        });

        it('requires zip', (done) => {
          setPropertyAndExpectPermissionDenied(
            (data) => {
              const modifiedAddress = Object.assign({}, simpleAddressData);
              delete modifiedAddress.zip;
              // noinspection Eslint
              data.locations = {};
              // noinspection Eslint
              data.locations[addressType] = modifiedAddress;
            }, done);
        });

        it('requires country', (done) => {
          setPropertyAndExpectPermissionDenied(
            (data) => {
              const modifiedAddress = Object.assign({}, simpleAddressData);
              delete modifiedAddress.country;
              // noinspection Eslint
              data.locations = {};
              // noinspection Eslint
              data.locations[addressType] = modifiedAddress;
            }, done);
        });

        it('takes no extra props', (done) => {
          setPropertyAndExpectPermissionDenied(
            (data) => {
              const modifiedAddress = Object.assign({}, simpleAddressData);
              modifiedAddress.extra = 'extraProp';
              // noinspection Eslint
              data.locations = {};
              // noinspection Eslint
              data.locations[addressType] = modifiedAddress;
            }, done);
        });
      }

      it('takes no extra parameter', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            // noinspection Eslint
            data.locations = {
              extra: 'extraProp'
            };
          }, done);
      });

      describe('sellingFrom', () => {
        testAddress('sellingFrom');
      });

      describe('shipTo', () => {
        testAddress('shipTo');
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

      it('sold', () => {
        throw new Error('TODO');
      });

      it('salePending', () => {
        throw new Error('TODO');
      });

    });

    it('friends', () => {
      throw new Error('TODO');
    });

    describe('payments', () => {
      const paymentData = {
        stripeCustomerId: 'fakeStripeCustomerId',
        stripeCardId: 'fakeStipeCardId',
        cardType: 'fakeCardType',
        lastFour: 1234,
        expirationDate: '01-19',
      };

      it('accepts valid payment data', (done) => {
        setPropertyAndExpectSuccessfulStore(
          (data) => {
            // noinspection Eslint
            data.payments = paymentData;
          }, done);
      });

      it('stripeCustomerId required', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const modifiedPayment = Object.assign({}, paymentData);
            delete modifiedPayment.stripeCustomerId;
            // noinspection Eslint
            data.payments = modifiedPayment;
          }, done);
      });

      it('stripeCardId required', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const modifiedPayment = Object.assign({}, paymentData);
            delete modifiedPayment.stripeCardId;
            // noinspection Eslint
            data.payments = modifiedPayment;
          }, done);
      });

      it('cardType required', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const modifiedPayment = Object.assign({}, paymentData);
            delete modifiedPayment.cardType;
            // noinspection Eslint
            data.payments = modifiedPayment;
          }, done);
      });

      it('lastFour required', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const modifiedPayment = Object.assign({}, paymentData);
            delete modifiedPayment.lastFour;
            // noinspection Eslint
            data.payments = modifiedPayment;
          }, done);
      });

      it('expirationDate required', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const modifiedPayment = Object.assign({}, paymentData);
            delete modifiedPayment.expirationDate;
            // noinspection Eslint
            data.payments = modifiedPayment;
          }, done);
      });

      it('expirationDate matches MM-YY', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const modifiedPayment = Object.assign({}, paymentData);
            modifiedPayment.expirationDate = '13-19';
            // noinspection Eslint
            data.payments = modifiedPayment;
          }, done);
      });

      it('accepts no extra data', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const modifiedPayment = Object.assign({}, paymentData);
            modifiedPayment.extraData = 'randomExtra';
            // noinspection Eslint
            data.payments = modifiedPayment;
          }, done);
      });
    });

    describe('merchant', () => {
      const merchantData = {
        accountNumberLast4: 4444,
        routingNumber: 325181028,
        publicKey: 'fakePublicKey',
        privateKey: 'fakePrivateKey',
        stripeBankId: 'fakeStripeBankId',
        stripeManagedAccountId: 'fakeManagedAccountId',
        stripeVerified: true,
      };

      it('stores valid date', (done) => {
        setPropertyAndExpectSuccessfulStore(
          (data) => {
            // noinspection Eslint
            data.merchant = merchantData;
          }, done);
      });

      it('stores minimal valid date', (done) => {
        setPropertyAndExpectSuccessfulStore(
          (data) => {
            // noinspection Eslint
            data.merchant = {
              stripeVerified: false
            };
          }, done);
      });

      it('accepts no extra data', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataWithExtra = Object.assign({}, merchantData);
            merchantDataWithExtra.extra = 'extraProp';
            // noinspection Eslint
            data.merchant = merchantDataWithExtra;
          }, done);
      });

      it('accountNumberLast4 is number', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataCopy = Object.assign({}, merchantData);
            merchantDataCopy.accountNumberLast4 = 'a string';
            // noinspection Eslint
            data.merchant = merchantDataCopy;
          }, done);
      });

      it('accountNumberLast4 is >3 digits', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataCopy = Object.assign({}, merchantData);
            merchantDataCopy.accountNumberLast4 = 123;
            // noinspection Eslint
            data.merchant = merchantDataCopy;
          }, done);
      });

      it('accountNumberLast4 is <5 digits', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataCopy = Object.assign({}, merchantData);
            merchantDataCopy.accountNumberLast4 = 12345;
            // noinspection Eslint
            data.merchant = merchantDataCopy;
          }, done);
      });

      it('routingNumber is number', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataCopy = Object.assign({}, merchantData);
            merchantDataCopy.routingNumber = 'a string';
            // noinspection Eslint
            data.merchant = merchantDataCopy;
          }, done);
      });

      it('publicKey is string', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataCopy = Object.assign({}, merchantData);
            merchantDataCopy.publicKey = 1;
            // noinspection Eslint
            data.merchant = merchantDataCopy;
          }, done);
      });

      it('privateKey is string', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataCopy = Object.assign({}, merchantData);
            merchantDataCopy.privateKey = 1;
            // noinspection Eslint
            data.merchant = merchantDataCopy;
          }, done);
      });

      it('stripeBankId is string', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataCopy = Object.assign({}, merchantData);
            merchantDataCopy.stripeBankId = 1;
            // noinspection Eslint
            data.merchant = merchantDataCopy;
          }, done);
      });

      it('stripeManagedAccountId is string', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataCopy = Object.assign({}, merchantData);
            merchantDataCopy.stripeManagedAccountId = 1;
            // noinspection Eslint
            data.merchant = merchantDataCopy;
          }, done);
      });

      it('stripeVerified required', () => {
        it('stores valid date', (done) => {
          setPropertyAndExpectPermissionDenied(
            (data) => {
              const merchantDataCopy = Object.assign({}, merchantData);
              delete merchantDataCopy.stripeVerified;
              // noinspection Eslint
              data.merchant = mermerchantDataCopychantData;
            }, done);
        });
      });

      it('stripeVerified is boolean', () => {
        it('stores valid date', (done) => {
          setPropertyAndExpectPermissionDenied(
            (data) => {
              const merchantDataCopy = Object.assign({}, merchantData);
              merchantDataCopy.stripeVerified = 'a string';
              // noinspection Eslint
              data.merchant = mermerchantDataCopychantData;
            }, done);
        });
      });
    });
  });
});
