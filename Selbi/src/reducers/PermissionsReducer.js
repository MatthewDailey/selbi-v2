import { getActionType } from './ActionUtils';

const PERMISSIONS_SET_DATA = 'set-permissions-data';
const PERMISSIONS_CLEAR_DATA = 'clear-permissions-data';

const undeterminedPerms = {
  location: 'undetermined',
  photo: 'undetermined',
  camera: 'undetermined',
};

export default function (priorState = undeterminedPerms, action) {
  switch (getActionType(action)) {
    case PERMISSIONS_SET_DATA:
      console.log(action);
      return Object.assign({}, action.data);
    case PERMISSIONS_CLEAR_DATA:
      return undeterminedPerms;
    default:
      return priorState;
  }
}

export function setPermissionsData(data) {
  return {
    type: PERMISSIONS_SET_DATA,
    data,
  };
}

export function clearPermissionsData() {
  return {
    type: PERMISSIONS_CLEAR_DATA,
  };
}

