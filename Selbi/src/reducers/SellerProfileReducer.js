import { getActionType } from './ActionUtils';

const SP_SET_LISTINGS = 'seller-profile-set-listings';
const SP_SET_INFO = 'seller-profile-set-info';
const SP_CLEAR = 'seller-profile-clear';

export default function (
  priorState = { uid: undefined, sellerData: undefined, listings: undefined }, action) {
  switch (getActionType(action)) {
    case SP_SET_INFO:
      return {
        uid: action.uid,
        listings: undefined,
        sellerData: action.sellerData,
      };
    case SP_SET_LISTINGS:
      return {
        uid: priorState.uid,
        listings: action.listings,
        sellerData: priorState.sellerData,
      };
    case SP_CLEAR:
      return {
        uid: undefined,
        listings: undefined,
        sellerData: undefined,
      };
    default:
      return priorState;
  }
}

export function setSellerProfileInfo(uid, sellerData) {
  return {
    type: SP_SET_INFO,
    uid,
    sellerData,
  };
}

export function setSellerProfileListings(listings) {
  return {
    type: SP_SET_LISTINGS,
    listings,
  };
}

export function clearSellerProfile() {
  return {
    type: SP_CLEAR,
  };
}