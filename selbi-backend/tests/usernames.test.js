import FirebaseTest, { minimalUserUid, testUserUid, expectUnableToStore }
  from '@selbi/firebase-test-resource';
import { expect } from 'chai';

const testMinimalUsername = 'minimaluser';

describe('/usernames', () => {
  beforeEach((done) => {
    FirebaseTest.serviceAccountApp.database()
      .ref('usernames')
      .child(minimalUserUid)
      .remove()
      .then(done)
      .catch(done);
  });

  it('can add username', (done) => {
    FirebaseTest.minimalUserApp.database()
      .ref('usernames')
      .child(minimalUserUid)
      .set(testMinimalUsername)
      .then(done)
      .catch(done);
  });

  it('can read other\'s username', (done) => {
    FirebaseTest.minimalUserApp.database()
      .ref('usernames')
      .child(minimalUserUid)
      .set(testMinimalUsername)
      .then(() => FirebaseTest.testUserApp.database()
          .ref('usernames')
          .child(minimalUserUid)
          .once('value'))
      .then((usernameSnapshot) => expect(usernameSnapshot.val()).to.equal(testMinimalUsername))
      .then(() => done())
      .catch(done);
  });

  it('cannot add number as username', (done) => {
    expectUnableToStore(
      FirebaseTest.minimalUserApp.database()
        .ref('usernames')
        .child(minimalUserUid)
        .set(1))
      .then(done)
      .catch(done);
  });

  it('cannot store another user\'s username', (done) => {
    expectUnableToStore(
      FirebaseTest.minimalUserApp.database()
        .ref('usernames')
        .child(testUserUid)
        .set(testMinimalUsername))
      .then(done)
      .catch(done);
  });
});
