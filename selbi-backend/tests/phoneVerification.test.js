import FirebaseTest, { expectUnableToStore } from '@selbi/firebase-test-resource';

const testPhoneNumber = '+12064379006';
const testCode = '0000';

describe('/phoneVerification', () => {
  beforeEach((done) => {
    FirebaseTest.serviceAccountApp.database()
      .ref('/phoneVerification')
      .child(testPhoneNumber)
      .remove()
      .then(done)
      .catch(done);
  });

  it('user cannot write', (done) => {
    expectUnableToStore(
      FirebaseTest.minimalUserApp.database()
        .ref('phoneVerification')
        .child(testPhoneNumber)
        .set(testCode))
      .then(done)
      .catch(done);
  });

  it('user cannot read', (done) => {
    FirebaseTest.serviceAccountApp.database()
      .ref('phoneVerification')
      .child(testPhoneNumber)
      .set(testCode)
      .then(() => FirebaseTest.minimalUserApp.database()
        .ref('phoneVerification')
        .child(testPhoneNumber)
        .once('value'))
      .then(() => {
        done(new Error('Should not be able to read verification number as user'));
      })
      .catch(() => done());
  });

  it('service account can write', (done) => {
    FirebaseTest.serviceAccountApp.database()
      .ref('phoneVerification')
      .child(testPhoneNumber)
      .set(testCode)
      .then(done)
      .catch(done);
  });
});

