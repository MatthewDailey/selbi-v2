import FirebaseTest, { minimalUserUid, testUserUid, expectUnableToStore }
  from '@selbi/firebase-test-resource';
import { expect } from 'chai';

const testMinimalUsername = 'minimaluser';

describe('/usernames', () => {
  beforeEach((done) => {
    FirebaseTest.serviceAccountApp.database()
      .ref('usernames')
      .child(testMinimalUsername)
      .remove()
      .then(done)
      .catch(done);
  });

  it('can add username', (done) => {
    FirebaseTest.minimalUserApp.database()
      .ref('usernames')
      .child(testMinimalUsername)
      .set(minimalUserUid)
      .then(done)
      .catch(done);
  });

  it('can read other\'s username', (done) => {
    FirebaseTest.minimalUserApp.database()
      .ref('usernames')
      .child(testMinimalUsername)
      .set(minimalUserUid)
      .then(() => FirebaseTest.testUserApp.database()
          .ref('usernames')
          .child(testMinimalUsername)
          .once('value'))
      .then((usernameSnapshot) => expect(usernameSnapshot.val()).to.equal(minimalUserUid))
      .then(() => done())
      .catch(done);
  });

  it('cannot add non-uid for username value', (done) => {
    expectUnableToStore(
      FirebaseTest.minimalUserApp.database()
        .ref('usernames')
        .child(testMinimalUsername)
        .set('not a uid'))
      .then(done)
      .catch(done);
  });

  it('cannot store another user\'s username', (done) => {
    expectUnableToStore(
      FirebaseTest.minimalUserApp.database()
        .ref('usernames')
        .child(testMinimalUsername)
        .set(testUserUid))
      .then(done)
      .catch(done);
  });
});
