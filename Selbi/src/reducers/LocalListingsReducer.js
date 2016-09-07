import { getActionType } from './ActionUtils';

const LL_SET_LOCAL_LISTINGS = 'local-listings-set';

export default function (localListingsState = null, action) {
  switch (getActionType(action)) {
    case LL_SET_LOCAL_LISTINGS:
      return action.localListings.slice();
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

