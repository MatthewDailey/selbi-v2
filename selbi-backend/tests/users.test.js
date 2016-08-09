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

    describe('name', () => {
      it('first required and is string', (done) => {
        const minimalDataMinusFirstName = JSON.parse(JSON.stringify(minimalUserData));
        delete minimalDataMinusFirstName.name.first;
        const minimalDataMinusFirstNamePromise = usersRef
          .child(minimalUserUid)
          .set(minimalDataMinusFirstName)
          .then(() => {
            done(new Error('Should not be able to store user data without name.first'));
          })
          .catch((error) => {
            expect(error.code).to.equal('PERMISSION_DENIED');
          });

        const minimalDataFirstNameNotString = JSON.parse(JSON.stringify(minimalUserData));
        minimalDataFirstNameNotString.name.first = 1;
        const minimalDataFirstNameNotStringPromise = usersRef
          .child(minimalUserUid)
          .set(minimalDataFirstNameNotString)
          .then(() => {
            done(new Error('Should not be able to store user data without string name.first'));
          })
          .catch((error) => {
            expect(error.code).to.equal('PERMISSION_DENIED');
          });

        Promise.all([minimalDataMinusFirstNamePromise,
            minimalDataFirstNameNotStringPromise])
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('last required and is string', (done) => {
        const minimalDataMinusLastName = JSON.parse(JSON.stringify(minimalUserData));
        delete minimalDataMinusLastName.name.last;
        const minimalDataMinusLastNamePromise = usersRef
          .child(minimalUserUid)
          .set(minimalDataMinusLastName)
          .then(() => {
            done(new Error('Should not be able to store user data without name.last'));
          })
          .catch((error) => {
            expect(error.code).to.equal('PERMISSION_DENIED');
          });

        const minimalDataLastNameNotString = JSON.parse(JSON.stringify(minimalUserData));
        minimalDataLastNameNotString.name.last = 1;
        const minimalDataLastNameNotStringPromise = usersRef
          .child(minimalUserUid)
          .set(minimalDataLastNameNotString)
          .then(() => {
            done(new Error('Should not be able to store user data without string name.last'));
          })
          .catch((error) => {
            expect(error.code).to.equal('PERMISSION_DENIED');
          });

        Promise.all([minimalDataMinusLastNamePromise,
            minimalDataLastNameNotStringPromise])
          .then(() => {
            done();
          })
          .catch(done);
      });
    });

    it('email is string', (done) => {
      const minimalDataEmailNotString = JSON.parse(JSON.stringify(minimalUserData));
      minimalDataEmailNotString.email = 1;
      usersRef
        .child(minimalUserUid)
        .set(minimalDataEmailNotString)
        .then(() => {
          done(new Error('Should not be able to store user data without string email'));
        })
        .catch((error) => {
          expect(error.code).to.equal('PERMISSION_DENIED');
          done();
        });
    });

    describe('profileImageUrl', () => {
      it('cannot be non-string', (done) => {
        const minimalDataProfileImageUrlNotString = JSON.parse(JSON.stringify(minimalUserData));
        minimalDataProfileImageUrlNotString.profileImageUrl = 1;
        usersRef
          .child(minimalUserUid)
          .set(minimalDataProfileImageUrlNotString)
          .then(() => {
            done(new Error('Should not be able to store user data with non-string ' +
              'profileImageUrl'));
          })
          .catch((error) => {
            expect(error.code).to.equal('PERMISSION_DENIED');
            done();
          });
      });

      it('cannot be non-url string', (done) => {
        const minimalProfileImageUrlNotUrl = JSON.parse(JSON.stringify(minimalUserData));
        minimalProfileImageUrlNotUrl.profileImageUrl = 'not a url';
        usersRef
          .child(minimalUserUid)
          .set(minimalProfileImageUrlNotUrl)
          .then(() => {
            done(new Error('Should not be able to store user data with non-string ' +
              'profileImageUrl'));
          })
          .catch((error) => {
            expect(error.code).to.equal('PERMISSION_DENIED');
            done();
          });
      });

      it('may begin with http://', (done) => {
        const minimalDataProfileImageUrlHttp = JSON.parse(JSON.stringify(minimalUserData));
        minimalDataProfileImageUrlHttp.profileImageUrl = 'http://cooldomain';
        usersRef
          .child(minimalUserUid)
          .set(minimalDataProfileImageUrlHttp)
          .then(done)
          .catch(done);
      });

      it('may begin with https://', (done) => {
        const minimalDataProfileImageUrlHttps = JSON.parse(JSON.stringify(minimalUserData));
        minimalDataProfileImageUrlHttps.profileImageUrl = 'https://cooldomain';
        console.log(minimalDataProfileImageUrlHttps);
        usersRef
          .child(minimalUserUid)
          .set(minimalDataProfileImageUrlHttps)
          .then(done)
          .catch(done);
      });
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
