import FirebaseTest, { minimalUserUid } from './FirebaseTestConnections';
// import { expect } from 'chai';

describe('listings', () => {
  before(function (done) {
    this.timeout(6000);
    FirebaseTest.dropDatabase()
      .then(done)
      .catch(done);
  });

  describe('/users/$uid/listing', () => {
    const usersRef = FirebaseTest.minimalUserApp.database().ref('/users/');

    it('accepts complete listings objects', (done) => {
      const modifiedMinimalUserData = FirebaseTest.getMinimalUserData();
      modifiedMinimalUserData.listings = {
        private: { l1: true },
        public: { l1: true },
        inactive: { l2: true },
        sold: { l3: true },
        salePending: { l4: true },
      };
      usersRef
        .child(minimalUserUid)
        .set(modifiedMinimalUserData)
        .then(done)
        .catch(done);
    });

    it('accepts empty listings objects', (done) => {
      // This test passes because Firebase ignores empty objects.
      const modifiedMinimalUserData = FirebaseTest.getMinimalUserData();
      modifiedMinimalUserData.listings = {};
      usersRef
        .child(FirebaseTest.minimalUserUid)
        .set(modifiedMinimalUserData)
        .then(done)
        .catch(done);
    });
  });
});
