import FirebaseTest, { minimalUserUid } from './FirebaseTestConnections';
// import { expect } from 'chai';

describe('/listings', () => {
  before(function (done) {
    this.timeout(6000);
    FirebaseTest
      .dropDatabase()
      .then(done)
      .catch(done);
  });

});
