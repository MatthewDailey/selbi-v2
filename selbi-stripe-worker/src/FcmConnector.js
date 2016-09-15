import FCM from 'fcm-node';

// selbi-develop server key.
const serverKey = 'AIzaSyBhYPzF_5cfoIpYvChaH3XS95JDFt4E0C4';

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


