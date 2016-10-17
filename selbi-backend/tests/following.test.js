import FirebaseTest, { minimalUserUid, testUserUid, expectUnableToStore }
  from '@selbi/firebase-test-resource';

import { expect } from 'chai';

describe('/following', () => {
  beforeEach((done) => {
    FirebaseTest.serviceAccountApp.database()
      .ref('following')
      .child(minimalUserUid)
      .remove()
      .then(done)
      .catch(done);
  });

  it('can follow another user', (done) => {
    FirebaseTest.minimalUserApp.database()
      .ref('following')
      .child(minimalUserUid)
      .child(testUserUid)
      .set(true)
      .then(done)
      .catch(done);
  });

  it('cannot add follower to another user', (done) => {
    expectUnableToStore(
      FirebaseTest.testUserApp.database()
        .ref('following')
        .child(minimalUserUid)
        .child(testUserUid)
        .set(true))
      .then(done)
      .catch(done);
  });

  it('cannot follow self', (done) => {
    expectUnableToStore(
      FirebaseTest.minimalUserApp.database()
        .ref('following')
        .child(minimalUserUid)
        .child(minimalUserUid)
        .set(true))
      .then(done)
      .catch(done);
  });

  it('can read own following list', (done) => {
    FirebaseTest.minimalUserApp.database()
      .ref('following')
      .child(minimalUserUid)
      .child(testUserUid)
      .set(true)
      .then(() => FirebaseTest.minimalUserApp.database()
        .ref('following')
        .child(minimalUserUid)
        .once('value'))
      .then((followingSnapshot) => expect(followingSnapshot.val()[testUserUid]).to.equal(true))
      .then(() => done())
      .catch(done);
  });

  it('cannot read other following list', (done) => {
    FirebaseTest.minimalUserApp.database()
      .ref('following')
      .child(minimalUserUid)
      .child(testUserUid)
      .set(true)
      .then(() => expectUnableToStore(FirebaseTest.testUserApp.database()
        .ref('following')
        .child(minimalUserUid)
        .once('value')))
      .then(done)
      .catch(done);
  });
});

