import { getActionType } from './ActionUtils';

const USER_SET_DATA = 'set-user-private-data';
const USER_CLEAR_DATA = 'clear-user-private-data';

export default function (priorState = {}, action) {
  switch (getActionType(action)) {
    case USER_SET_DATA:
      return Object.assign({}, action.data);
    case USER_CLEAR_DATA:
      return {};
    default:
      return priorState;
  }
}

export function setUserPrivateData(data) {
  return {
    type: USER_SET_DATA,
    data,
  };
}

export function clearUserPrivateData() {
  return {
    type: USER_CLEAR_DATA,
  };
}
