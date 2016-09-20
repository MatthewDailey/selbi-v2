import { getActionType } from './ActionUtils';

const ML_SET_INACTIVE_LISTINGS = 'my-listings-set-inactive';
const ML_SET_PRIVATE_LISTINGS = 'my-listings-set-private';
const ML_SET_PUBLIC_LISTINGS = 'my-listings-set-public';
const ML_SET_SOLD_LISTINGS = 'my-listings-set-sold';
const ML_CLEAR = 'my-listings-clear';

const myListingsInitialState = {
  private: [],
  public: [],
  inactive: [],
  sold: [],
};

export default function (myListingsState = Object.assign({}, myListingsInitialState), action) {
  const newListingState = Object.assign({}, myListingsState);
  switch (getActionType(action)) {
    case ML_SET_INACTIVE_LISTINGS:
      newListingState.inactive = action.listings;
      return newListingState;
    case ML_SET_PUBLIC_LISTINGS:
      newListingState.public = action.listings;
      return newListingState;
    case ML_SET_PRIVATE_LISTINGS:
      newListingState.private = action.listings;
      return newListingState;
    case ML_SET_SOLD_LISTINGS:
      newListingState.sold = action.listings;
      return newListingState;
    case ML_CLEAR:
      return Object.assign({}, myListingsInitialState);
    default:
      return newListingState;
  }
}

export function setMyListingsInactive(newInactiveListings) {
  return {
    type: ML_SET_INACTIVE_LISTINGS,
    listings: newInactiveListings,
  };
}

export function setMyListingsPublic(newPublicListings) {
  return {
    type: ML_SET_PUBLIC_LISTINGS,
    listings: newPublicListings,
  };
}

export function setMyListingsPrivate(newPrivateListings) {
  return {
    type: ML_SET_PRIVATE_LISTINGS,
    listings: newPrivateListings,
  };
}

export function setMyListingsSold(newSoldListings) {
  return {
    type: ML_SET_SOLD_LISTINGS,
    listings: newSoldListings,
  };
}

export function clearMyListings() {
  return {
    type: ML_CLEAR,
  };
}
