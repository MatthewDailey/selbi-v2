import FirebaseTest, { minimalUserUid, testUserUid, expectUnableToStore }
  from '@selbi/firebase-test-resource';

import { expect } from 'chai';

describe('/blocking', () => {
  beforeEach(function(done) {
    this.timeout(6000);
    FirebaseTest.serviceAccountApp.database()
      .ref('blocking')
      .child(minimalUserUid)
      .remove()
      .then(done)
      .catch(done);
  });

  it('can write own blocking', (done) => {
    FirebaseTest
      .minimalUserApp
      .database()
      .ref('blocking')
      .child(minimalUserUid)
      .child(testUserUid)
      .set(true)
      .then(done)
      .catch(done);
  });

  it('cannot write others blocking', (done) => {
    expectUnableToStore(
      FirebaseTest.testUserApp.database()
        .ref('blocking')
        .child(minimalUserUid)
        .child(testUserUid)
        .set(true))
      .then(done)
      .catch(done);
  });

  it('cannot block self', (done) => {
    expectUnableToStore(
      FirebaseTest.minimalUserApp.database()
        .ref('blocking')
        .child(minimalUserUid)
        .child(minimalUserUid)
        .set(true))
      .then(done)
      .catch(done);
  });

  it('can read own blocking list', (done) => {
    FirebaseTest.minimalUserApp.database()
      .ref('blocking')
      .child(minimalUserUid)
      .child(testUserUid)
      .set(true)
      .then(() => FirebaseTest.minimalUserApp.database()
        .ref('blocking')
        .child(minimalUserUid)
        .once('value'))
      .then((followingSnapshot) => expect(followingSnapshot.val()[testUserUid]).to.equal(true))
      .then(() => done())
      .catch(done);
  });

  it('cannot read other blocking list', (done) => {
    FirebaseTest.minimalUserApp.database()
      .ref('blocking')
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
