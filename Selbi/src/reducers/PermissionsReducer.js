import { getActionType } from './ActionUtils';

const PERMISSIONS_SET_DATA = 'set-permissions-data';
const PERMISSIONS_SET_SINGLE = 'set-permissions-single';
const PERMISSIONS_CLEAR_DATA = 'clear-permissions-data';

const undeterminedPerms = {
  location: 'undetermined',
  photo: 'undetermined',
  camera: 'undetermined',
};

export default function (priorState = undeterminedPerms, action) {
  switch (getActionType(action)) {
    case PERMISSIONS_SET_DATA:
      return Object.assign({}, action.data);
    case PERMISSIONS_SET_SINGLE:
      const newState = Object.assign({}, priorState);
      newState[action.key] = action.value;
      return newState;
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

export function setSinglePermission(key, value) {
  return {
    type: PERMISSIONS_SET_SINGLE,
    key,
    value,
  };
}

export function clearPermissionsData() {
  return {
    type: PERMISSIONS_CLEAR_DATA,
  };
}

