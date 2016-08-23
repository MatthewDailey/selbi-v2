import FirebaseTest, { minimalUserUid, deepCopy, expectUnableToStore } from
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

  describe('must have all properties', () => {
    let modifiedTestData = null;

    beforeEach(() => {
      modifiedTestData = deepCopy(testImageData);
    });

    it('requires owner', (done) => {
      delete modifiedTestData.owner;

      expectUnableToStore(
        FirebaseTest
          .minimalUserApp
          .database()
          .ref('images')
          .push(modifiedTestData))
        .then(done)
        .catch(done);
    });
  });
});

