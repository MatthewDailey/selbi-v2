import FCM from 'fcm-node';
import rc from 'rc';


const localConfig = rc('selbi', {});

// selbi-develop server key.
let serverKey = 'AIzaSyBhYPzF_5cfoIpYvChaH3XS95JDFt4E0C4';

if (localConfig.fcmConfig) {
  console.log('Found local config');
  console.log(localConfig.fcmConfig);
  serverKey = localConfig.fcmConfig.serverKey;
} else if (process.env.SELBI_ENVIRONMENT === 'staging') {
  serverKey = 'AIzaSyD_Bulgkwih0Am3KRAMyFXofOYnToDuqeU';
} else if (process.env.SELBI_ENVIRONMENT === 'production') {
  serverKey = 'AIzaSyCOPH8E6s9tFtzbN4n-2kL-dZ6hb0KNHiI';
}

const fcm = new FCM(serverKey);

export default undefined;

export function sendNotification(targetFcmToken, title, body) {
  const message = {
    to: targetFcmToken,
    notification: {
      title,
      body,
      priority: 'high',
      show_in_foreground: true,
      badge: '1',
      sound: 'Default',
    },
  };

  console.log(' Sending message:', message);

  return new Promise((resolve, reject) => {
    fcm.send(message, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}


