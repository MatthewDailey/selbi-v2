import FirebaseTest, { minimalUserUid } from
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
  before((done) => {
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
        done();
      })
      .catch(done);
  });
});

