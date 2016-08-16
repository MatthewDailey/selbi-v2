import express from 'express';
import firebase from 'firebase';
import ServiceAccount from '@selbi/service-accounts';

const serviceAccountApp = firebase.initializeApp(ServiceAccount.firebaseConfigFromEnvironment(),
  'serviceUser');

function createListing() {
  serviceAccountApp
    .database()
    .ref('test')
    .push({ c: 1 })
    .then(() => {
      console.log('created test element.');
    })
    .catch(console.log);
}

createListing();

const app = express();

app.get('/', (req, res) => {
  res.send({
    status: 'OK',
    service: 'stripe-worker',
  });
});
app.listen(8080);

console.log('App can run.');
