import { getActionType } from './ActionUtils';

const USER_SET_DATA = 'set-user-data';
const USER_CLEAR_DATA = 'clear-user-data';

export default function (priorState = { displayName: undefined, username: undefined }, action) {
  switch (getActionType(action)) {
    case USER_SET_DATA:
      return Object.assign({}, action.data);
    case USER_CLEAR_DATA:
      return { displayName: undefined, username: undefined };
    default:
      return priorState;
  }
}

export function setUserData(data) {
  return {
    type: USER_SET_DATA,
    data,
  };
}

export function clearUserData() {
  return {
    type: USER_CLEAR_DATA,
  };
}

