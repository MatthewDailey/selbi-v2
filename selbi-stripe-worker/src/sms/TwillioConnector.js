
import twilio from 'twilio';

const twilioAccountSid = 'AC21c328a896543f751d70f26702e77a7c';
const twilioAuthToken = '5e7ca65f34e2d19100cb01cf9b2fd67d';
const twilioPhoneNumber = '+16505673524';

const twilioClient = new twilio.RestClient(twilioAccountSid, twilioAuthToken);


export default undefined;

export function sendSms(phoneNumber, message) {
  return new Promise((resolve, reject) => {
    twilioClient.messages.create({
      to: phoneNumber,
      from: twilioPhoneNumber,
      body: message,
    }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
