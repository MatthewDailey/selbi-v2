
import { sendFlaggedInappropriateContentEmail } from '../EmailConnector';

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

  handle(data, firebaseDb) {
    const loadListingData = () => firebaseDb
      .ref('listings')
      .child(data.payload.listingId)
      .once('value')
      .then((dataSnapshot) => {
        if (dataSnapshot.exists()) {
          return Promise.resolve(dataSnapshot.val());
        }
        return Promise.reject(`Unable to load listing ${data.payload.listingId}`);
      });

    const loadSellerData = (listingData) => {
      const promisePublicData = firebaseDb
        .ref('userPublicData')
        .child(listingData.sellerId)
        .once('value')
        .then((dataSnapshot) => {
          if (dataSnapshot.exists()) {
            return Promise.resolve(dataSnapshot.val());
          }
          return Promise.reject(`Unable to load user public data ${listingData.sellerId}`);
        });

      const promisePrivateData = firebaseDb
        .ref('users')
        .child(listingData.sellerId)
        .once('value')
        .then((dataSnapshot) => {
          if (dataSnapshot.exists()) {
            return Promise.resolve(dataSnapshot.val());
          }
          return Promise.reject(`Unable to load user private data ${listingData.sellerId}`);
        });

      return Promise.all([promisePublicData, promisePrivateData])
        .then((results) => {
          return {
            listingData,
            sellerData: {
              id: listingData.sellerId,
              publicData: results[0],
              privateData: results[1],
            },
          };
        });
    };

    return validateFollowPayload(data.payload)
      .then(loadListingData)
      .then(loadSellerData)
      .then((listingAndSellerData) => {
        console.log(listingAndSellerData)
        return sendFlaggedInappropriateContentEmail(
          listingAndSellerData.sellerData.id,
          listingAndSellerData.sellerData,
          data.payload.listingUrl,
          data.payload.listingId,
          listingAndSellerData.listingData,
          data.owner);
      })
      .then(() => console.log(`Sent email about reported listing id: ${data.payload.listingId}`
        + ` reporter: ${data.owner}`));
  }
}

