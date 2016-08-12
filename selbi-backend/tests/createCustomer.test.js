import { expect } from 'chai';
import Queue from 'firebase-queue';
import FirebaseTest from './FirebaseTestConnections';

function testSafeWorker(worker, done) {
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

describe('Create Customer', () => {
  beforeEach((done) => {
    FirebaseTest
      .serviceAccountApp
      .database()
      .ref('/createCustomer')
      .remove()
      .then(done);
  });

  it('can create queue and handle work', function (done) {
    this.timeout(10000);

    const testData = {
      foo: 'bar',
    };

    new Queue(
      FirebaseTest.serviceAccountApp.database().ref('/createCustomer'),
      testSafeWorker(
        (data) => {
          expect(data.foo).to.equal(testData.foo);
        },
        done));

    FirebaseTest
      .serviceAccountApp
      .database()
      .ref('/createCustomer/tasks')
      .child('testData')
      .set(testData);
  });

  it('cannot write directly to /createCustomer', (done) => {
    FirebaseTest
      .testUserApp
      .database()
      .ref('createCustomer')
      .push({
        foo: 'bar',
      })
      .then(() => {
        done(new Error('Should not be able to store directly to /createCustomer'));
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
        done();
      });
  });
});
