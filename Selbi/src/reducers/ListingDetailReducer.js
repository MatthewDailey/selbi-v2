import { getActionType } from './ActionUtils';

const LD_SET_DETAILS = 'listing-details-set';
const LD_CLEAR_DETAILS = 'listing-details-clear';

export default function (listingDetailsState = {}, action) {
  switch (getActionType(action)) {
    case LD_SET_DETAILS:
      return Object.assign({}, action.data);
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

export function setListingDetails(image, listing) {
  return {
    type: LD_SET_DETAILS,
    data: {
      imageKey: image.key,
      imageData: image.data,
      listingKey: listing.key,
      listingData: listing.data,
    },
  };
}
