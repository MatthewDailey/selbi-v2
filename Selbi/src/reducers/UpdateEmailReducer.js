import { getActionType } from './ActionUtils';

const UE_SET = 'set-update-email';
const UE_CLEAR = 'clear-update-email';

export default function (priorState = '', action) {
  switch (getActionType(action)) {
    case UE_SET:
      return action.email;
    case UE_CLEAR:
      return '';
    default:
      return priorState;
  }
}

export function setUpdateEmail(email) {
  return {
    type: UE_SET,
    email,
  };
}

export function clearUpdateEmail() {
  return {
    type: UE_CLEAR,
  };
}