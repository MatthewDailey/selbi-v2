import AuthenticationClient from './AuthenticationClient';
import FirebaseSupplier from './FirebaseSupplier';

module.exports = {
  SelbiAuth: new AuthenticationClient(FirebaseSupplier),
};
