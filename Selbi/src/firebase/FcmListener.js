import FCM from 'react-native-fcm';

export default undefined;

// Requires we upgrade React Native version and react-native-fcm version
export function setBadgeNumber(n) {
  FCM.setBadgeNumber(n);
}

let unsubscribeFromFcmToken;

export function subscribeToFcmTokenRefresh(handler) {
  unsubscribeFromFcmToken = FCM.on('refreshToken', handler);
}

export function unsubscribeFromFcmTokenRefresh() {
  if (unsubscribeFromFcmToken) {
    unsubscribeFromFcmToken();
  }
}
