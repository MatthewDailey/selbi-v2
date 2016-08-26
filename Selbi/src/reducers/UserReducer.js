import Immutable from 'immutable';
import { getActionType } from './ActionUtils';

const USER_SET_DATA = 'set-user-data';
const USER_SET_TOKEN = 'set-user-token';

class User extends Immutable.Record({
  data: undefined,
  token: undefined,
}) {}

export default function (userState = new User(), action) {
  switch (getActionType(action)) {
    case USER_SET_DATA:
      return userState.merge({ data: action.data });
    case USER_SET_TOKEN:
      return userState.merge({ token: action.token });
    default:
      return userState;
  }
}

export function setUserData(userData) {
  return {
    type: USER_SET_DATA,
    data: userData,
  };
}

export function setUserToken(userToken) {
  return {
    type: USER_SET_TOKEN,
    token: userToken,
  };
}