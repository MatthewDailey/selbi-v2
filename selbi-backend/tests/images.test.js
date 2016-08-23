import FirebaseTest, { minimalUserUid, testUserUid, deepCopy, expectUnableToStore } from
  '@selbi/firebase-test-resource';
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

chai.use(dirtyChai);

/*
 * /images is used to store any images we need to store in Firebase.
 */

const testImageData = {
  owner: minimalUserUid,
  base64: 'FAKE+BASE64+IMAGE+DATA',
  height: 50,
  width: 100,
};

describe('/images tests', () => {
  before(function (done) {
    this.timeout(6000);
    FirebaseTest
      .dropDatabase()
      .then(() => FirebaseTest.createMinimalUser())
      .then(done);
  });

  it('can store properly formatted image', (done) => {
    FirebaseTest
      .minimalUserApp
      .database()
      .ref('images')
      .push(testImageData)
      .then((snapshot) => {
        expect(snapshot).to.exist();
      })
      .then(done)
      .catch(done);
  });

  describe('invalid data formats', () => {
    let modifiedTestData = null;

    beforeEach(() => {
      modifiedTestData = deepCopy(testImageData);
    });

    function storeModifiedDataAndExpectFailure(done) {
      expectUnableToStore(
        FirebaseTest
          .minimalUserApp
          .database()
          .ref('images')
          .push(modifiedTestData))
        .then(done)
        .catch(done);
    }

    describe('must have all properties', () => {
      it('requires owner', (done) => {
        delete modifiedTestData.owner;
        storeModifiedDataAndExpectFailure(done);
      });

      it('requires height', (done) => {
        delete modifiedTestData.height;
        storeModifiedDataAndExpectFailure(done);
      });

      it('requires width', (done) => {
        delete modifiedTestData.width;
        storeModifiedDataAndExpectFailure(done);
      });

      it('requires base64', (done) => {
        delete modifiedTestData.base64;
        storeModifiedDataAndExpectFailure(done);
      });
    });

    describe('user authentication', () => {
      it('must write as owner', (done) => {
        modifiedTestData.owner = testUserUid;
        storeModifiedDataAndExpectFailure(done);
      });

      it('can only update if owner', (done) => {
        FirebaseTest
          .minimalUserApp
          .database()
          .ref('images')
          .push(modifiedTestData)
          .then((newDataRef) => expectUnableToStore(
              FirebaseTest
                .testUserApp
                .database()
                .ref('images')
                .child(newDataRef.key)
                .update({ height: 1 })))
          .then(done)
          .catch(done);
      });
    });

    describe('types', () => {
      it('owner is string', (done) => {
        modifiedTestData.owner = 1;
        storeModifiedDataAndExpectFailure(done);
      });

      it('base64 is string', (done) => {
        modifiedTestData.base64 = 1;
        storeModifiedDataAndExpectFailure(done);
      });

      it('height is int', (done) => {
        modifiedTestData.height = "a string";
        storeModifiedDataAndExpectFailure(done);
      });

      it('width is int', (done) => {
        modifiedTestData.width = "a string";
        storeModifiedDataAndExpectFailure(done);
      });
    });
  });
});

