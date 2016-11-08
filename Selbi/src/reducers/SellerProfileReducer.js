import { getActionType } from './ActionUtils';

const SP_SET_LISTINGS = 'seller-profile-set-listings';
const SP_SET_INFO = 'seller-profile-set-info';
const SP_CLEAR = 'seller-profile-clear';

export default function (
  priorState = {
    uid: undefined,
    sellerData: undefined,
    listings: {
      uninitialized: true,
    },
  },
  action) {
  switch (getActionType(action)) {
    case SP_SET_INFO:
      return {
        uid: action.uid,
        sellerData: action.sellerData,
        listings: {
          uninitialized: true,
        },
      };
    case SP_SET_LISTINGS:
      return {
        uid: priorState.uid,
        sellerData: priorState.sellerData,
        listings: action.listings,
      };
    case SP_CLEAR:
      return {
        uid: undefined,
        sellerData: undefined,
        listings: {
          uninitialized: true,
        },
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