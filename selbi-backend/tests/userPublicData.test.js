import { expect } from 'chai';
import FirebaseTest, { minimalUserUid, expectUnableToStore } from '@selbi/firebase-test-resource';

const sampleUserPublicData = {
  displayName: 'Matt Dailey',
  profileImageUrl: 'https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-9/12741983_10208490353834533' +
    '_7138930131848794213_n.jpg?oh=726eae9fde50187d2f14d5012c6c4fe5&oe=5852666A',
};

describe('/userPublicData', () => {
  before(function (done) {
    this.timeout(6000);
    FirebaseTest
      .dropDatabase()
      .then(() => FirebaseTest.createMinimalUser())
      .then(done)
      .catch(done);
  });

  it('user can create own data', (done) => {
    FirebaseTest
      .minimalUserApp
      .database()
      .ref('userPublicData')
      .child(minimalUserUid)
      .set(sampleUserPublicData)
      .then(done)
      .catch(done);
  });

  it('user cannot create data for another user', (done) => {
    expectUnableToStore(
      FirebaseTest
        .testUserApp
        .database()
        .ref('userPublicData')
        .child(minimalUserUid)
        .set(sampleUserPublicData))
      .then(done)
      .catch(done);
  });

  it('can read another users data', (done) => {
    FirebaseTest
      .minimalUserApp
      .database()
      .ref('userPublicData')
      .child(minimalUserUid)
      .set(sampleUserPublicData)
      .then(() => FirebaseTest
        .testUserApp
        .database()
        .ref('userPublicData')
        .child(minimalUserUid)
        .once('value'))
      .then((minimalUserPublicData) => {
        expect(minimalUserPublicData.exists());
        expect(minimalUserPublicData.val().displayName).to.equal(sampleUserPublicData.displayName);
      })
      .then(done)
      .catch(done);
  });

  it('requires display name', (done) => {
    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('userPublicData')
        .child(minimalUserUid)
        .set({
          profileImageUrl: sampleUserPublicData.profileImageUrl,
        }))
      .then(done)
      .catch(done);
  });

  it('display name is string', (done) => {
    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('userPublicData')
        .child(minimalUserUid)
        .set({
          displayName: 1,
        }))
      .then(done)
      .catch(done);
  });

  it('does not require image', (done) => {
    FirebaseTest
      .minimalUserApp
      .database()
      .ref('userPublicData')
      .child(minimalUserUid)
      .set({
        displayName: sampleUserPublicData.displayName,
      })
      .then(done)
      .catch(done);
  });

  it('profileImageUrl is string', (done) => {
    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('userPublicData')
        .child(minimalUserUid)
        .set({
          profileImageUrl: 1,
        }))
      .then(done)
      .catch(done);
  });

  it('takes no extra params', (done) => {
    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('userPublicData')
        .child(minimalUserUid)
        .set({
          displayName: sampleUserPublicData.displayName,
          extraParam: 'some random shit',
        }))
      .then(done)
      .catch(done);
  });
});

