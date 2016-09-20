import { sendNotification } from './src/FcmConnector';

const testDeviceFcmToken = 'eXqBBeOjjFQ:APA91bG99q8f7FttN1nxse2DYWNrF2bkZ4kdtn7oEZvjLa04gKmpHoicB2su90Xjm6qbPB6iPc9bK9o58YEXV5uVqWHv3oIXpiqz7Vf5IUYtMlgCp3svr-iDhguTO5wJRDHxqcs7efCj';

/*
 * Note that the app name and body will appear on the lock screen but under the notification
 * header for the app the title and body will be visible.
 *
 * A good format would be:
 * title: 'New Message about <listing name>'
 * body: '<author name>: <message contents>'
 */

sendNotification(
  testDeviceFcmToken,
  {
    title: 'Wassup bruh',
    body: 'new notification body fa sho',
  })
  .then(console.log)
  .catch(console.log);
