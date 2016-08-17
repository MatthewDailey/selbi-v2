import { expect } from 'chai';
import FirebaseTest, { minimalUserUid } from '../src/index';


describe('firebase test resources', () => {
  before((done) => {
    FirebaseTest
      .dropDatabase()
      .then(done)
      .catch(done);
  });

  it('can be imported', (done) => {
    FirebaseTest
      .createMinimalUser()
      .then(() => FirebaseTest
        .minimalUserApp
        .database()
        .ref('users')
        .child(minimalUserUid)
        .once('value'))
      .then((snapshot) => {
        expect(snapshot.exists()).to.equal(true);
      })
      .then(done)
      .catch(done);
  });
});
