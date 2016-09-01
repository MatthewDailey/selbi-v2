import { expect } from 'chai';
import FirebaseTest, { testUserUid, minimalUserUid, extraUserUid } from
  '@selbi/firebase-test-resource';

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

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

describe('/users', () => {
  function getCreateFakeUsersFunction(done) {
    return () => {
      const usersRef = FirebaseTest.serviceAccountApp
        .database()
        .ref('/users');

      const createTestUserPromise = usersRef
        .child(FirebaseTest.testUserUid)
        .set(FirebaseTest.getTestUserData());

      const createFakeUserPromise = usersRef
        .child(FirebaseTest.extraUserUid)
        .set(FirebaseTest.getTestUserData());

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

    FirebaseTest
      .dropDatabase()
      .then(getCreateFakeUsersFunction(done))
      .catch(done);
  });

  it('user no extra params', (done) => {
    const testUserDataWithExtra = FirebaseTest.getTestUserData();
    testUserDataWithExtra.extra = 'extraProp';
    FirebaseTest
      .testUserApp
      .database()
      .ref('/users')
      .child(FirebaseTest.testUserUid)
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
    FirebaseTest
      .serviceAccountApp
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
    const usersRef = FirebaseTest
      .minimalUserApp
      .database()
      .ref('/users');

    it('accepts minimal user', (done) => {
      usersRef
        .child(minimalUserUid)
        .set(FirebaseTest.getMinimalUserData())
        .then(done)
        .catch(done);
    });
  });

  describe('as schemaTestUser', () => {
    const usersRef = FirebaseTest.testUserApp.database().ref('/users');

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
    const usersRef = FirebaseTest.serviceAccountApp.database().ref('/users');

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
    const usersRef = FirebaseTest.minimalUserApp.database().ref('/users');

    function setPropertyAndExpectSuccessfulStore(objectModification, done) {
      const minimalUserDataCopy = FirebaseTest.getMinimalUserData();
      objectModification(minimalUserDataCopy);
      usersRef
        .child(minimalUserUid)
        .set(minimalUserDataCopy)
        .then(done)
        .catch(done);
    }

    function setPropertyAndExpectPermissionDenied(objectModification, done) {
      const minimalUserDataCopy = FirebaseTest.getMinimalUserData();
      objectModification(minimalUserDataCopy);
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

      it('is required', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            // We need to add a name because an empty node will succeed but nothing will be stored.
            // noinspection Eslint
            data.name = {
              first: 'test',
              last: 'user',
            };
            // noinspection Eslint
            delete data.userAgreementAccepted;
          }, done);
      });
    });

    it('email is string', (done) => {
      setPropertyAndExpectPermissionDenied(
        (data) => {
          // noinspection Eslint
          data.email = 1;
        }, done);
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

    describe('payment', () => {
      const paymentData = {
        stripeCustomerPointer: 'fakeStripeCustomerId',
        status: 'OK',
        metadata: {
          cardBrand: 'Visa',
          lastFour: 1234,
          expirationDate: '01-19',
        },
      };

      it('accepts valid payment data', (done) => {
        setPropertyAndExpectSuccessfulStore(
          (data) => {
            // noinspection Eslint
            data.payment = paymentData;
          }, done);
      });

      it('stripeCustomerPointer required', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const modifiedPayment = deepCopy(paymentData);
            delete modifiedPayment.stripeCustomerPointer;
            // noinspection Eslint
            data.payment = modifiedPayment;
          }, done);
      });

      it('status required', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const modifiedPayment = deepCopy(paymentData);
            delete modifiedPayment.status;
            // noinspection Eslint
            data.payment = modifiedPayment;
          }, done);
      });

      it('cardBrand required', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const modifiedPayment = deepCopy(paymentData);
            delete modifiedPayment.metadata.cardBrand;
            // noinspection Eslint
            data.payment = modifiedPayment;
          }, done);
      });

      it('lastFour required', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const modifiedPayment = deepCopy(paymentData);
            delete modifiedPayment.metadata.lastFour;
            // noinspection Eslint
            data.payment = modifiedPayment;
          }, done);
      });

      it('expirationDate matches MM-YY', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const modifiedPayment = deepCopy(paymentData);
            modifiedPayment.metadata.expirationDate = '13-19';
            // noinspection Eslint
            data.payment = modifiedPayment;
          }, done);
      });

      it('accepts no extra data', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const modifiedPayment = deepCopy(paymentData);
            modifiedPayment.extraData = 'randomExtra';
            // noinspection Eslint
            data.payment = modifiedPayment;
          }, done);
      });
    });

    describe('merchant', () => {
      const merchantData = {
        stripeAccountPointer: 'fakeAccountPointer',
        status: 'OK',
        metadata: {
          accountNumberLastFour: 4444,
          routingNumber: 325181028,
          bankName: 'WSECU',
        },
      };

      it('stores valid data', (done) => {
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
              status: 'ERROR: test error.'
            };
          }, done);
      });

      it('accepts no extra data', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataWithExtra = deepCopy(merchantData);
            merchantDataWithExtra.extra = 'extraProp';
            // noinspection Eslint
            data.merchant = merchantDataWithExtra;
          }, done);
      });

      it('accountNumberLast4 is number', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataCopy = deepCopy(merchantData);
            merchantDataCopy.metadata.accountNumberLastFour = 'a string';
            // noinspection Eslint
            data.merchant = merchantDataCopy;
          }, done);
      });

      it('accountNumberLast4 is >3 digits', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataCopy = deepCopy(merchantData);
            merchantDataCopy.metadata.accountNumberLastFour = 123;
            // noinspection Eslint
            data.merchant = merchantDataCopy;
          }, done);
      });

      it('accountNumberLast4 is <5 digits', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataCopy = deepCopy(merchantData);
            merchantDataCopy.metadata.accountNumberLastFour = 12345;
            // noinspection Eslint
            data.merchant = merchantDataCopy;
          }, done);
      });

      it('routingNumber is number', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataCopy = deepCopy(merchantData);
            merchantDataCopy.metadata.routingNumber = 'a string';
            // noinspection Eslint
            data.merchant = merchantDataCopy;
          }, done);
      });

      it('bankName is string', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataCopy = deepCopy(merchantData);
            merchantDataCopy.metadata.bankName = 1;
            // noinspection Eslint
            data.merchant = merchantDataCopy;
          }, done);
      });

      it('status is string', (done) => {
        setPropertyAndExpectPermissionDenied(
          (data) => {
            const merchantDataCopy = deepCopy(merchantData);
            merchantDataCopy.status = 1;
            // noinspection Eslint
            data.merchant = merchantDataCopy;
          }, done);
      });
    });
  });
});
