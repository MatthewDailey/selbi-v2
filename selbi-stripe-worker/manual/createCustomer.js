import FirebaseTest, { minimalUserUid } from '@selbi/firebase-test-resource';

describe('create customer test', () => {
  it('can create', (done) => {
    const testData = {
      payload: {
        source: 'tok_18jML3LzdXFwKk7fwVy7q3QR',
        description: 'test user',
        email: 'matt@selbi.io',
      },
      metadata: {
        lastFour: 1234,
        expirationDate: '01-19',
      },
      uid: minimalUserUid,
    };

    FirebaseTest
      .minimalUserApp
      .database()
      .ref('/createCustomer/tasks')
      .child('testData')
      .set(testData)
      .then(done)
      .catch(done);
  });
});
