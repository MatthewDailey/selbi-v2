import { getActionType } from './ActionUtils';

const SP_SET_LISTINGS = 'seller-profile-set-listings';
const SP_SET_UID = 'seller-profile-set-uid';
const SP_CLEAR = 'seller-profile-clear';



export default function (priorState = { uid: undefined, listings: undefined }, action) {
  switch (getActionType(action)) {
    case SP_SET_UID:
      return {
        uid: action.uid,
        listings: undefined,
      };
    case SP_SET_LISTINGS:
      return {
        uid: priorState.uid,
        listings: action.listings,
      };
    case SP_CLEAR:
      return {
        uid: undefined,
        listings: undefined,
      };
    default:
      return priorState;
  }
}

export function setSellerProfileUid(uid) {
  return {
    type: SP_SET_UID,
    uid,
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