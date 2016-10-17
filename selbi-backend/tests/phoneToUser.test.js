import FirebaseTest, { minimalUserUid, expectUnableToStore }
  from '@selbi/firebase-test-resource';

import { expect } from 'chai';

const testPhoneNumber = '2064379006';

describe('/phoneToUser', () => {
  beforeEach((done) => {
    FirebaseTest.serviceAccountApp.database()
      .ref('/phoneToUser')
      .child(testPhoneNumber)
      .remove()
      .then(done)
      .catch(done);
  });

  it('user cannot write', (done) => {
    expectUnableToStore(
      FirebaseTest.minimalUserApp.database()
        .ref('phoneToUser')
        .child(testPhoneNumber)
        .set(minimalUserUid))
      .then(done)
      .catch(done);
  });

  it('user can read', (done) => {
    FirebaseTest.serviceAccountApp.database()
      .ref('phoneToUser')
      .child(testPhoneNumber)
      .set(minimalUserUid)
      .then(() => FirebaseTest.minimalUserApp.database()
        .ref('phoneToUser')
        .child(testPhoneNumber)
        .once('value'))
      .then((result) => {
        expect(result.exists()).to.equal(true);
        expect(result.val()).to.equal(minimalUserUid);
      })
      .then(done)
      .catch(done);
  });

  it('service account can write', (done) => {
    FirebaseTest.serviceAccountApp.database()
      .ref('phoneToUser')
      .child(testPhoneNumber)
      .set(minimalUserUid)
      .then(done)
      .catch(done);
  });
});

