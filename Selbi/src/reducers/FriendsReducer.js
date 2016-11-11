import { getActionType } from './ActionUtils';

const SET_FOLLOWING = 'set-following';
const SET_FOLLOWERS = 'set-followers';
const CLEAR = 'clear-friends';

export default function (priorState = { following: {}, followers: {} }, action) {
  switch (getActionType(action)) {
    case SET_FOLLOWERS:
      console.log(action)
      return {
        followers: action.followers,
        following: priorState.following,
      };
    case SET_FOLLOWING:
      console.log(action)
      return {
        followers: priorState.followers,
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
};