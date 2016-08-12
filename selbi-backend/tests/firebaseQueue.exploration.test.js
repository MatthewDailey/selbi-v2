import Queue from 'firebase-queue';
import FirebaseTest from './FirebaseTestConnections';

const queue = new Queue(
  FirebaseTest.serviceAccountApp.database().ref('sample-queue'),
  (data, progress, resolve, reject) => {
    console.log(data);

    setTimeout(() => {
      resolve();
    }, 1000);
  });

function createData() {
  FirebaseTest
    .testUserApp
    .database()
    .ref('/sample-queue/tasks')
    .push({
      foo: 'bar'
    })
    .then((data) => {
      console.log(data);
    });
}

createData();

setTimeout(() => {
  createData();
}, 1000);

setTimeout(() => {
  createData();
}, 10000);

