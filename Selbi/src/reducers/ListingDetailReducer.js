import { getActionType } from './ActionUtils';

const LD_SET_DETAILS = 'listing-details-set';
const LD_SET_BUYER = 'listing-details-set-buyer';
const LD_CLEAR_DETAILS = 'listing-details-clear';
const LD_SET_LISTING_DATA = 'listing-details-set-data';

export default function (listingDetailsState = {}, action) {
  const listingDetails = Object.assign({}, listingDetailsState);
  switch (getActionType(action)) {
    case LD_SET_DETAILS:
      return Object.assign({}, action.data);
    case LD_SET_BUYER:
      listingDetails.buyerUid = action.buyerUid;
      return listingDetails;
    case LD_SET_LISTING_DATA:
      listingDetails.listingData = action.data;
      return listingDetails;
    case LD_CLEAR_DETAILS:
      return {};
    default:
      return listingDetailsState;
  }
}

export function clearListingDetails() {
  return {
    type: LD_CLEAR_DETAILS,
  };
}

export function setBuyerUid(buyer) {
  return {
    type: LD_SET_BUYER,
    buyerUid: buyer,
  };
}

export function setListingData(listingData) {
  return {
    type: LD_SET_LISTING_DATA,
    data: listingData,
  };
}

export function setBuyerAndListingDetails(buyer, listing) {
  return {
    type: LD_SET_DETAILS,
    data: {
      buyerUid: buyer,
      listingKey: listing.key,
      listingData: listing.data,
    },
  };
}
