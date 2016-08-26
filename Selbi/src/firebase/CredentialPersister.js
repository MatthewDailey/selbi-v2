import { AsyncStorage } from 'react-native';

export default undefined;

export function initializeCredentials() {
  return AsyncStorage.getItem('credentials').then(JSON.parse);
}

export function storeCredentials(credentials) {
  AsyncStorage.setItem('credentials', JSON.stringify(credentials));
}
