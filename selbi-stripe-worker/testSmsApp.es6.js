import { sendSms } from './src/sms/TwillioConnector';

sendSms('2064379006', 'Hi from Selbi!')
  .then(console.log)
  .catch(console.log);
