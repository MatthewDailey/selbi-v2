import { expect } from 'chai';
import Queue from 'firebase-queue';
import FirebaseTest, { testUserUid } from '@selbi/firebase-test-resource';

import { testSafeWorker } from './QueueUtilities';

describe('/createPurchase', () => {
  beforeEach(function (done) {
    this.timeout(6000);
    FirebaseTest
      .serviceAccountApp
      .database()
      .ref('/purchase')
      .remove()
      .then(done);
  });

  function writeToQueueAndExpectHandled(firebaseUserApp, testData, done) {
    new Queue(
      FirebaseTest.serviceAccountApp.database().ref('/createPurchase'),
      testSafeWorker(
        (data) => {
          expect(data.buyerUid).to.equal(testData.buyerUid);
          expect(data.listingId).to.equal(testData.listingId);
        },
        done));

    firebaseUserApp
      .database()
      .ref('/createPurchase/tasks')
      .child('testData')
      .set(testData)
      .catch(done);
  }

  it('can enqueue purchase as user', (done) => {
    const testData = {
      buyerUid: testUserUid,
      listingId: 'testlistingid',
    };
    writeToQueueAndExpectHandled(FirebaseTest.testUserApp, testData, done);
  });
});
