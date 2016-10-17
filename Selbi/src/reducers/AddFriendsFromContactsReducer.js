import Immutable from 'immutable';
import { getActionType } from './ActionUtils';

class AddCreditCardData extends Immutable.Record({
  number: undefined,
  code: undefined,
}) {}

const ADD_PHONE_NUMBER = 'add-phone-number';
const ADD_PHONE_CODE = 'add-phone-code';
const ADD_PHONE_CLEAR = 'add-phone-clear';

export default function (priorState = new AddCreditCardData(), action) {
  switch (getActionType(action)) {
    case ADD_PHONE_NUMBER:
      return priorState.merge({ number: action.number });
    case ADD_PHONE_CODE:
      return priorState.merge({ code: action.code });
    case ADD_PHONE_CLEAR:
      return new AddCreditCardData();
    default:
      return priorState;
  }
}

export function setPhoneNumber(number) {
  return {
    type: ADD_PHONE_NUMBER,
    number,
  };
}

export function setPhoneCode(code) {
  return {
    type: ADD_PHONE_CODE,
    code,
  };
}

export function clearPhoneData() {
  return {
    type: ADD_PHONE_CLEAR,
  };
}
