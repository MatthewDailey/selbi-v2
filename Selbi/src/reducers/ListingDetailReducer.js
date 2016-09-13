import { getActionType } from './ActionUtils';

const LD_SET_DETAILS = 'listing-details-set';
const LD_SET_BUYER = 'listing-details-set-buyer';
const LD_CLEAR_DETAILS = 'listing-details-clear';

export default function (listingDetailsState = {}, action) {
  switch (getActionType(action)) {
    case LD_SET_DETAILS:
      return Object.assign({}, action.data);
    case LD_SET_BUYER:
      const listingDetails = Object.assign({}, listingDetailsState);
      listingDetails.buyerUid = action.buyerUid;
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

export function setListingDetails(buyer, listing) {
  return {
    type: LD_SET_DETAILS,
    data: {
      buyerUid: buyer,
      listingKey: listing.key,
      listingData: listing.data,
    },
  };
}
