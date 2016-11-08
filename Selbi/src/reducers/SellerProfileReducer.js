import { getActionType } from './ActionUtils';

const SP_SET_PUBLIC_LISTINGS = 'seller-profile-set-public-listings';
const SP_SET_PRIVATE_LISTINGS = 'seller-profile-set-public-listings';
const SP_SET_INFO = 'seller-profile-set-info';
const SP_CLEAR = 'seller-profile-clear';

const uninitialized = {
  uninitialized: true,
};

export default function (
  priorState = {
    uid: undefined,
    sellerData: undefined,
    publicListings: uninitialized,
    privateListings: uninitialized,
  },
  action) {
  switch (getActionType(action)) {
    case SP_SET_INFO:
      return {
        uid: action.uid,
        sellerData: action.sellerData,
        publicListings: uninitialized,
        privateListings: uninitialized,
      };
    case SP_SET_PUBLIC_LISTINGS:
      return {
        uid: priorState.uid,
        sellerData: priorState.sellerData,
        publicListings: action.listings,
        privateListings: priorState.privateListings,
      };
    case SP_SET_PRIVATE_LISTINGS:
      return {
        uid: priorState.uid,
        sellerData: priorState.sellerData,
        publicListings: priorState.publicListings,
        privateListings: action.listings,
      };
    case SP_CLEAR:
      return {
        uid: undefined,
        sellerData: undefined,
        publicListings: uninitialized,
        privateListings: uninitialized,
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

export function setSellerProfilePublicListings(listings) {
  return {
    type: SP_SET_PUBLIC_LISTINGS,
    listings,
  };
}

export function setSellerProfilePrivateListings(listings) {
  return {
    type: SP_SET_PUBLIC_LISTINGS,
    listings,
  };
}

export function clearSellerProfile() {
  return {
    type: SP_CLEAR,
  };
}