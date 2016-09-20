import { getActionType } from './ActionUtils';

const FF_FRIEND_USERNAME_INPUT = 'follow-friend-username-input';

export default function (initialState = {}, action) {
  switch (getActionType(action)) {
    case FF_FRIEND_USERNAME_INPUT:
      return { username: action.username };
    default:
      return initialState;
  }
}

export function setPossibleFriendUsername(username) {
  return {
    type: FF_FRIEND_USERNAME_INPUT,
    username,
  };
}
