import { getActionType } from './ActionUtils';

const FL_SET_FRIENDS_LISTINGS = 'friends-listings-set';

export default function (localListingsState = null, action) {
  switch (getActionType(action)) {
    case FL_SET_FRIENDS_LISTINGS:
      return action.listings.slice();
    default:
      return localListingsState;
  }
}

export function setFriendsListings(listings) {
  return {
    type: FL_SET_FRIENDS_LISTINGS,
    listings,
  };
}

