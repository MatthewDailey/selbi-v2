import dirtyChai from 'dirty-chai';
import chai, { expect } from 'chai';

import AuthClient from '../src/AuthenticationClient';

chai.use(dirtyChai);

describe('AuthenticationClient Test', () => {
  it('can get login status', () => {
    expect(AuthClient.isLoggedIn()).to.be.false();
  });

  it('can login anonymously', (done) => {
    AuthClient.onAuthStateChange(() => {
      expect(AuthClient.isLoggedIn()).to.be.true();
      done();
    });

    AuthClient
      .signInAnonymously()
      .catch(done);
  });

  it('can sign out', (done) => {
    AuthClient
      .signOut()
      .then(done)
      .catch(done);
  });

  it('can sign in and signout', (done) => {
    AuthClient
      .signInAnonymously()
      .then(() => expect(AuthClient.isLoggedIn()).to.be.true())
      .then(AuthClient.signOut)
      .then(() => expect(AuthClient.isLoggedIn()).to.be.false())
      .then(() => done())
      .catch(done);
  });
});

