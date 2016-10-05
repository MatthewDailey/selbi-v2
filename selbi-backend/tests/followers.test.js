import FirebaseTest, { minimalUserUid, testUserUid, expectUnableToStore }
  from '@selbi/firebase-test-resource';

import { expect } from 'chai';

describe('/followers', () => {
  beforeEach((done) => {
    FirebaseTest.serviceAccountApp.database()
      .ref('followers')
      .child(testUserUid)
      .remove()
      .then(done)
      .catch(done);
  });

  it('can follow another user', (done) => {
    FirebaseTest.minimalUserApp.database()
      .ref('followers')
      .child(testUserUid)
      .child(minimalUserUid)
      .set(true)
      .then(done)
      .catch(done);
  });

  it('cannot follow self', (done) => {
    expectUnableToStore(
      FirebaseTest.minimalUserApp.database()
        .ref('followers')
        .child(minimalUserUid)
        .child(minimalUserUid)
        .set(true))
      .then(done)
      .catch(done);
  });

  it('can read own following list', (done) => {
    FirebaseTest.minimalUserApp.database()
      .ref('followers')
      .child(testUserUid)
      .child(minimalUserUid)
      .set(true)
      .then(() => FirebaseTest.testUserApp.database()
        .ref('followers')
        .child(testUserUid)
        .once('value'))
      .then((followingSnapshot) => expect(followingSnapshot.val()[minimalUserUid]).to.equal(true))
      .then(() => done())
      .catch(done);
  });

  it('cannot read other following list', (done) => {
    FirebaseTest.minimalUserApp.database()
      .ref('followers')
      .child(testUserUid)
      .child(minimalUserUid)
      .set(true)
      .then(() => expectUnableToStore(FirebaseTest.minimalUserApp.database()
        .ref('followers')
        .child(testUserUid)
        .once('value')))
      .then(done)
      .catch(done);
  });
});

