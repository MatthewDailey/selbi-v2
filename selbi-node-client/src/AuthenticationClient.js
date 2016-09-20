import { getFirebase } from './FirebaseSupplier';

const firebase = getFirebase();

class AuthenticationClient {
  signInAnonymously() {
    return firebase
      .auth()
      .signInAnonymously();
  }

  signOut() {
    return firebase
      .auth()
      .signOut();
  }

  authenticateWithFacebookToken(facebookAccessToken) {

  }

  onAuthStateChange(authStateObserver) {
    return firebase
      .auth()
      .onAuthStateChanged(authStateObserver);
  }

  isLoggedIn() {
    return firebase.auth().currentUser != null;
  }
}

module.exports = new AuthenticationClient();
