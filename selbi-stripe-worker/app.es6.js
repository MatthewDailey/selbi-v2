import express from 'express';
import firebase from 'firebase';
import initializeStripe from 'stripe';

import ServiceAccount from '@selbi/service-accounts';
import CreateCustomerHandler from './src/CreateCustomerHandler';
import QueueListener from './src/QueueListener';

const stripe = initializeStripe(process.env.STRIPE_PRIVATE);

const serviceAccountApp = firebase.initializeApp(ServiceAccount.firebaseConfigFromEnvironment(),
  'serviceUser');
const firebaseDb = serviceAccountApp.database();

const createCustomerHandler = new CreateCustomerHandler(firebaseDb, stripe.customers);
const createCustomerQueueListener = new QueueListener('/createCustomer');

createCustomerQueueListener.start(firebaseDb, createCustomerHandler.getTaskHandler());

process.on('SIGINT', () => {
  console.log('Received SIGINT, starting graceful shutdown...');

  createCustomerQueueListener
    .shutdown()
    .then(() => serviceAccountApp.delete())
    .then(() => console.log('Graceful shutdown of firebase connections complete.'))
    .then(() => process.exit(0))
    .catch(() => process.exit(0));
});

const app = express();

app.get('/', (req, res) => {
  res.send({
    status: 'OK',
    service: 'stripe-worker',
  });
});
app.listen(8080);

console.log('stripe-worker has started.');
