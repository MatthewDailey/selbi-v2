import FCM from 'fcm-node';

// selbi-develop server key.
let serverKey = 'AIzaSyBhYPzF_5cfoIpYvChaH3XS95JDFt4E0C4';

if (process.env.SELBI_ENVIRONMENT === 'staging') {
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
      badge: '1',
      sound: 'Default',
    },
  };

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


