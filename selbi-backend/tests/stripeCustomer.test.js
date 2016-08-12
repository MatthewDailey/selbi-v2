import { expect } from 'chai';
import FirebaseTest from './FirebaseTestConnections';

// For the stripeCustomer endpoint we store data returned from the Stripe Connect API. Users will
// have no access to this data so we don't care much about the schema, just that it's safe.
describe('Stripe Customer', () => {
  beforeEach((done) => {
    FirebaseTest
      .serviceAccountApp
      .database()
      .ref('/stripeCustomer')
      .remove()
      .then(done);
  });

  it('user cannot write', (done) => {
    FirebaseTest
      .testUserApp
      .database()
      .ref('stripeCustomer')
      .push({ foo: 'bar' })
      .then(() => {
        done(new Error('Should not be able to store'));
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
        done();
      });
  });

  it('user cannot read', (done) => {
    FirebaseTest
      .testUserApp
      .database()
      .ref('stripeCustomer')
      .once('value')
      .then(() => {
        done(new Error('Should not be able to store'));
      })
      .catch((error) => {
        expect(error.code).to.equal('PERMISSION_DENIED');
        done();
      });
  });

  it('service account can write and read', (done) => {
    FirebaseTest
      .serviceAccountApp
      .database()
      .ref('stripeCustomer')
      .child('customer1')
      .set({ foo: 'bar' })
      .then(() => FirebaseTest
          .serviceAccountApp
          .database()
          .ref('stripeCustomer')
          .child('customer1')
          .once('value'))
      .then((snapshot) => {
        expect(snapshot.exists()).to.equal(true);
        done();
      })
      .catch(done);
  });

});
