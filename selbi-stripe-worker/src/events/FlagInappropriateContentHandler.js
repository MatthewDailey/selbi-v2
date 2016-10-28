
const INAPPROPRIATE_CONTENT_EVENT_TYPE = 'inappropriate-content';

function validateFollowPayload(payload) {
  if (!payload) {
    return Promise.reject('Follow event must have payload');
  }
  if (!payload.listingId) {
    return Promise.reject('Follow event payload does not include listingId');
  }
  if (!payload.listingUrl) {
    return Promise.reject('Follow event payload does not include listingUrl');
  }
  return Promise.resolve();
}

export default class FlagInappropriateContentHandler {
  accept(data) {
    return data.type === INAPPROPRIATE_CONTENT_EVENT_TYPE;
  }

  handle(data, firebaseDb, sendNotification) {
    return validateFollowPayload(data.payload)
      .then(() => console.log(data));
  }
}

