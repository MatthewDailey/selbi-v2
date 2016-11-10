import Immutable from 'immutable';
import { getActionType } from './ActionUtils';

class FeedbackData extends Immutable.Record({
  email: undefined,
  message: undefined,
}) {}

const F_SET_EMAIL = 'feedback-set-email';
const F_SET_MESSAGE = 'feedback-set-message';
const F_CLEAR = 'feedback-clear';

export default function (priorState = new FeedbackData(), action) {
  switch (getActionType(action)) {
    case F_SET_EMAIL:
      return priorState.merge({ email: action.email });
    case F_SET_MESSAGE:
      return priorState.merge({ message: action.message });
    case F_CLEAR:
      return new FeedbackData();
    default:
      return priorState;
  }
}

export function setFeedbackEmail(email) {
  return {
    type: F_SET_EMAIL,
    email,
  };
}

export function setFeedbackMessage(message) {
  return {
    type: F_SET_MESSAGE,
    message,
  };
}

export function clearFeedback() {
  return {
    type: F_CLEAR,
  };
}
