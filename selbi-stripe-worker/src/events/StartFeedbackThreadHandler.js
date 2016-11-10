
import { sendFeedbackEmail } from '../EmailConnector';

const FEEDBACK_EVENT_TYPE = 'feedback';

function validateFollowPayload(payload) {
  if (!payload) {
    return Promise.reject('Feedback event must have payload');
  }
  if (!payload.message) {
    return Promise.reject('Feedback event payload does not include message');
  }
  if (!payload.email) {
    return Promise.reject('Feedback event payload does not include email');
  }
  return Promise.resolve();
}

export default class FlagInappropriateContentHandler {
  accept(data) {
    return data.type === FEEDBACK_EVENT_TYPE;
  }

  handle(data) {
    return validateFollowPayload(data.payload)
      .then(() => sendFeedbackEmail(data.owner, data.payload.email, data.payload.message))
      .then(() => console.log(`Successfully send feedback email to user:${data.owner}`
        + `at ${data.payload.email}`));
  }
}

