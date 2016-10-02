import { getActionType } from './ActionUtils';

const LL_SET_LOCAL_LISTINGS = 'local-listings-set';
const LL_ADD_LOCAL_LISTING = 'add-local-listing';
const LL_CLEAR_LOCAL_LISTINGS = 'clear-local-listings';

export default function (localListingsState = null, action) {
  switch (getActionType(action)) {
    case LL_SET_LOCAL_LISTINGS:
      return action.localListings;
    case LL_ADD_LOCAL_LISTING:
      const copyOfState = Object.assign({}, localListingsState);
      copyOfState[action.newListing.key] = action.newListing;
      return copyOfState;
    case LL_CLEAR_LOCAL_LISTINGS:
      return null;
    default:
      return localListingsState;
  }
}

export function setLocalListings(newLocalListings) {
  return {
    type: LL_SET_LOCAL_LISTINGS,
    localListings: newLocalListings,
  };
}

export function addLocalListing(newListing) {
  return {
    type: LL_ADD_LOCAL_LISTING,
    newListing,
  };
}

export function clearLocalListings() {
  return {
    type: LL_CLEAR_LOCAL_LISTINGS,
  };
}