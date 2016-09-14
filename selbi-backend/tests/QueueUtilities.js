import { expect } from 'chai';
import Queue from 'firebase-queue';
import FirebaseTest from '@selbi/firebase-test-resource';

export default undefined;

export function testSafeWorker(worker, done) {
  return (data, progress, resolve, reject) => {
    try {
      worker(data);
      resolve();
      done();
    } catch (e) {
      reject(e);
      done(e);
    }
  };
}

export function writeToQueueAndExpectHandled(firebaseUserApp, queuePath, testData, done) {
  new Queue(
    FirebaseTest.serviceAccountApp.database().ref(queuePath),
    testSafeWorker(
      (data) => Object.keys(testData).forEach((key) => expect(data[key]).to.equal(testData[key])),
      done));

  firebaseUserApp
    .database()
    .ref(`${queuePath}/tasks`)
    .push()
    .set(testData);
}
