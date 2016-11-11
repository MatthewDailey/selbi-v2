import { getActionType } from './ActionUtils';

const SET_FOLLOWING = 'set-following';
const SET_FOLLOWERS = 'set-followers';
const CLEAR = 'clear-friends';

export default function (priorState = { following: {}, followers: {} }, action) {
  switch (getActionType(action)) {
    case SET_FOLLOWERS:
      return {
        ...priorState,
        followers: action.followers,
      };
    case SET_FOLLOWING:
      return {
        ...priorState,
        following: action.following,
      };
    case CLEAR:
      return {
        following: {},
        followers: {},
      };
    default:
      return priorState;
  }
}

export function setFollowers(followers) {
  return {
    type: SET_FOLLOWERS,
    followers,
  };
}

export function setFollowing(following) {
  return {
    type: SET_FOLLOWING,
    following,
  };
}

export function clearFriends() {
  return {
    type: CLEAR,
  };
}