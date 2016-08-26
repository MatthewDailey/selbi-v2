import Immutable from 'immutable';
import { getActionType } from './ActionUtils';

const USER_SET_DATA = 'set-user-data';
const USER_SET_CREDENTIAL = 'set-user-credential';

class User extends Immutable.Record({
  data: undefined,
  credential: undefined,
}) {}

export default function (userState = new User(), action) {
  switch (getActionType(action)) {
    case USER_SET_DATA:
      return userState.merge({ data: action.data });
    case USER_SET_CREDENTIAL:
      return userState.merge({ credential: action.credential });
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

export function setUserCredential(userCredential) {
  return {
    type: USER_SET_CREDENTIAL,
    credential: userCredential,
  };
}