import { expect } from 'chai';
import FirebaseTest  from '@selbi/firebase-test-resource';

describe('/listings', () => {
  before(function (done) {
    this.timeout(6000);

    FirebaseTest
      .dropDatabase()
      .then(() => FirebaseTest.createMinimalUser())
      .then(done)
      .catch(done);
  });

  function storeListingAsMinimalUserAndExpectFailure(dataToStore, errorMessage, done) {
    FirebaseTest
      .minimalUserApp
      .database()
      .ref('/listings')
      .child('shouldNotExist')
      .set(dataToStore)
      .then(() => {
        done(new Error(errorMessage));
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
        done();
      });
  }

  it('is list', (done) => {
    const promiseStoreFirstListing = FirebaseTest
      .minimalUserApp
      .database()
      .ref('/listings')
      .child('listingOne')
      .set(FirebaseTest.getMinimalUserListingOne());
    const promiseStoreSecondListing = FirebaseTest
      .minimalUserApp
      .database()
      .ref('/listings')
      .child('listingTwo')
      .set(FirebaseTest.getMinimalUserListingTwo());

    const verifyThatBothListingsAreStored = () => {
      // Note we use the service account to read because we don't allow reading all listings.
      FirebaseTest
        .serviceAccountApp
        .database()
        .ref('/listings')
        .once('value')
        .then((snapshot) => {
          expect(Object.keys(snapshot.val()).length).to.equal(2);
          done();
        })
        .catch(done);
    };

    Promise.all([promiseStoreFirstListing, promiseStoreSecondListing])
      .then(verifyThatBothListingsAreStored)
      .catch(done);
  });

  it('cannot have any extra properties', (done) => {
    const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
    modifiedMinimalUserListing.extraProp = 'extra-prop';
    storeListingAsMinimalUserAndExpectFailure(
      modifiedMinimalUserListing,
      'Should not be able to create listings for non-existant user.',
      done);
  });

  describe('title', () => {
    it('Must be string', (done) => {
      const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
      modifiedMinimalUserListing.title = 1;
      storeListingAsMinimalUserAndExpectFailure(
        modifiedMinimalUserListing,
        'Title cannot be an int.',
        done);
    });
  });

  describe('description', () => {
    it('Must be string', (done) => {
      const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
      modifiedMinimalUserListing.description = 1;
      storeListingAsMinimalUserAndExpectFailure(
        modifiedMinimalUserListing,
        'Description cannot be an int.',
        done);
    });
  });

  describe('price', () => {
    it('Must be number', (done) => {
      const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
      modifiedMinimalUserListing.price = 'a string';
      storeListingAsMinimalUserAndExpectFailure(
        modifiedMinimalUserListing,
        'Price cannot be a string.',
        done);
    });

    it('Must be >0', (done) => {
      const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
      modifiedMinimalUserListing.price = -1;
      storeListingAsMinimalUserAndExpectFailure(
        modifiedMinimalUserListing,
        'Price cannot be negative',
        done);
    });
  });

  describe('sellerId', () => {
    it('user can only create own listings', (done) => {
      FirebaseTest
        .testUserApp
        .database()
        .ref('/listings')
        .child('shouldNotExist')
        .set(FirebaseTest.getMinimalUserListingOne())
        .then(() => {
          done(new Error('Should not be able to create listings for another user.'));
        })
        .catch((error) => {
          expect(error.code).to.equal('PERMISSION_DENIED');
          done();
        });
    });

    it('can only create listings for existing user', (done) => {
      FirebaseTest
        .testUserApp
        .database()
        .ref('/listings')
        .child('shouldNotExist')
        .set(FirebaseTest.getTestUserListingOne())
        .then(() => {
          done(new Error('Should not be able to create listings for non-existant user.'));
        })
        .catch((error) => {
          expect(error.code).to.equal('PERMISSION_DENIED');
          done();
        });
    });
  });

  describe('images', () => {
    it('can create with valid data', (done) => {
      const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
      modifiedMinimalUserListing.images = [
        {
          imageId: 'fake-image-id',
          height: 20,
          width: 20,
        },
        {
          imageId: 'second-image-id',
          height: 30,
          width: 30,
        },
      ];
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('listings')
        .push(modifiedMinimalUserListing)
        .then(() => done())
        .catch(done);
    });

    it('Must be object', (done) => {
      const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
      modifiedMinimalUserListing.images = 1;
      storeListingAsMinimalUserAndExpectFailure(
        modifiedMinimalUserListing,
        'ImageUrls cannot be int',
        done);
    });

    describe('property validation', () => {
      it('images must be objects', (done) => {
        const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
        modifiedMinimalUserListing.images = ['normal string'];
        storeListingAsMinimalUserAndExpectFailure(
          modifiedMinimalUserListing,
          'ImageUrls content must be urls',
          done);
      });

      it('can have no extra properties', (done) => {
        const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
        modifiedMinimalUserListing.images[0].extraProp = 'extra';
        storeListingAsMinimalUserAndExpectFailure(
          modifiedMinimalUserListing,
          'Can have no extra properties',
          done);
      });

      describe('required', () => {
        it('imageId', (done) => {
          const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
          delete modifiedMinimalUserListing.images[0].imageId;
          storeListingAsMinimalUserAndExpectFailure(
            modifiedMinimalUserListing,
            'Can have no extra properties',
            done);
        });

        it('height', (done) => {
          const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
          delete modifiedMinimalUserListing.images[0].height;
          storeListingAsMinimalUserAndExpectFailure(
            modifiedMinimalUserListing,
            'Can have no extra properties',
            done);
        });

        it('width', (done) => {
          const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
          delete modifiedMinimalUserListing.images[0].width;
          storeListingAsMinimalUserAndExpectFailure(
            modifiedMinimalUserListing,
            'Can have no extra properties',
            done);
        });
      });

      describe('type', () => {
        it('imageId is string', (done) => {
          const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
          modifiedMinimalUserListing.images[0].imageId = 1;
          storeListingAsMinimalUserAndExpectFailure(
            modifiedMinimalUserListing,
            'Can have no extra properties',
            done);
        });

        it('height is number', (done) => {
          const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
          modifiedMinimalUserListing.images[0].height = 'a string';
          storeListingAsMinimalUserAndExpectFailure(
            modifiedMinimalUserListing,
            'Can have no extra properties',
            done);
        });

        it('width is number', (done) => {
          const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
          modifiedMinimalUserListing.images[0].width = 'a string';
          storeListingAsMinimalUserAndExpectFailure(
            modifiedMinimalUserListing,
            'Can have no extra properties',
            done);
        });
      })
    });
  });

  describe('category', () => {
    it('Must be string', (done) => {
      const modifiedMinimalUserListing = FirebaseTest.getMinimalUserListingTwo();
      modifiedMinimalUserListing.category = 1;
      storeListingAsMinimalUserAndExpectFailure(
        modifiedMinimalUserListing,
        'Category cannot be an int.',
        done);
    });
  });
});
