import { expect } from 'chai';
import FirebaseTest, { minimalUserUid, testUserUid, extraUserUid, expectUnableToStore, deepCopy }
  from '@selbi/firebase-test-resource';

const listingId = 'listingOne';

const messageOne = {
  text: 'a cool message',
  createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)).getTime(),
  authorUid: minimalUserUid,
};

const messageTwo = {
  text: 'a second cool message',
  createdAt: new Date(Date.UTC(2016, 7, 30, 17, 21, 0)),
  authorUid: testUserUid,
};

describe('/messages', () => {
  before(function (done) {
    this.timeout(6000);
    FirebaseTest
      .dropDatabase()
      .then(() => FirebaseTest.createMinimalUser())
      .then(() => FirebaseTest
        .minimalUserApp
        .database()
        .ref('/listings')
        .child(listingId)
        .set(FirebaseTest.getMinimalUserListingOne()))
      .then(done)
      .catch(done);
  });

  it('user can store basic message', (done) => {
    FirebaseTest
      .minimalUserApp
      .database()
      .ref('/messages')
      .child(listingId)
      .child(testUserUid)
      .push()
      .set(messageOne)
      .then(done)
      .catch(done);
  });

  it('cannot store directly to /messages', (done) => {
    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('messages')
        .set(messageOne))
      .then(done)
      .catch(done);
  });

  it('cannot store directly to /messages/$listingId', (done) => {
    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('messages')
        .child(listingId)
        .set(messageOne))
      .then(done)
      .catch(done);
  });

  it('cannot store directly to /messages/$listingId/$buyerUid', (done) => {
    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('messages')
        .child(listingId)
        .child(testUserUid)
        .set(messageOne))
      .then(done)
      .catch(done);
  });

  it('cannot update own message', (done) => {
    const newMessageRef = FirebaseTest
      .minimalUserApp
      .database()
      .ref('/messages')
      .child(listingId)
      .child(testUserUid)
      .push();

    expectUnableToStore(
      newMessageRef
        .set(messageOne)
        .then(() => newMessageRef
          .update({
            text: "new text that shouldn't appear",
          })))
      .then(done)
      .catch(done);
  });

  it('cannot write another user message', (done) => {
    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('/messages')
        .child(listingId)
        .child(testUserUid)
        .push()
        .set(messageTwo))
      .then(done)
      .catch(done);
  });

  it('requires text', (done) => {
    const copyOfMessageOne = deepCopy(messageOne);
    delete copyOfMessageOne.text;

    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('/messages')
        .child(listingId)
        .child(testUserUid)
        .push()
        .set(copyOfMessageOne))
      .then(done)
      .catch(done);
  });

  it('requires createdAt', (done) => {
    const copyOfMessageOne = deepCopy(messageOne);
    delete copyOfMessageOne.createdAt;

    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('/messages')
        .child(listingId)
        .child(testUserUid)
        .push()
        .set(copyOfMessageOne))
      .then(done)
      .catch(done);
  });

  it('requires authorUid', (done) => {
    const copyOfMessageOne = deepCopy(messageOne);
    delete copyOfMessageOne.authorUid;

    expectUnableToStore(
      FirebaseTest
        .minimalUserApp
        .database()
        .ref('/messages')
        .child(listingId)
        .child(testUserUid)
        .push()
        .set(copyOfMessageOne))
      .then(done)
      .catch(done);
  });

  it('cannot read unassociated chat', (done) => {
    const messageRef = FirebaseTest
      .minimalUserApp
      .database()
      .ref('/messages')
      .child(listingId)
      .child(extraUserUid)
      .push();

    expectUnableToStore(
      messageRef.set(messageOne)
        .then(() => FirebaseTest
          .testUserApp
          .database()
          .ref('messages')
          .child(listingId)
          .child(extraUserUid)
          .child(messageRef.key)
          .once('value')))
      .then(done)
      .catch(done);
  });

  it('can read associated chat', (done) => {
    const messageRef = FirebaseTest
      .minimalUserApp
      .database()
      .ref('/messages')
      .child(listingId)
      .child(extraUserUid)
      .push();

    messageRef.set(messageOne)
      .then(() => FirebaseTest
        .minimalUserApp
        .database()
        .ref('messages')
        .child(listingId)
        .child(extraUserUid)
        .child(messageRef.key)
        .once('value'))
      .then((result) => expect(result).to.exist)
      .then(() => done())
      .catch(done);
  });
});
