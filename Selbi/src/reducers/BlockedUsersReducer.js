import { getActionType } from './ActionUtils';

const BU_SET_USERS = 'blocking-users-set';
const BU_CLEAR_USERS = 'blocking-users-clear';

export default function (priorState = {}, action) {
  switch (getActionType(action)) {
    case BU_SET_USERS:
      return action.blockedUsers;
    case BU_CLEAR_USERS:
      return {};
    default:
      return priorState;
  }
}

export function setBlockedUsers(blockedUsers) {
  return {
    type: BU_SET_USERS,
    blockedUsers,
  };
}

export function clearBlockedUsers() {
  return {
    type: BU_CLEAR_USERS,
  };
}