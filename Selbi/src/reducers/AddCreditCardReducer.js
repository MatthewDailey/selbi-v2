import Immutable from 'immutable';
import { getActionType } from './ActionUtils';

const CC_SET_DATA = 'set-credit-card-number';
const CC_CLEAR = 'clear-credit-card';

export const AddCreditCardStatus = {
  enteringData: 'entering-data',
  gettingKey: 'getting-key',
  creatingAccount: 'creating-account',
};

class AddCreditCardData extends Immutable.Record({
  valid: undefined, // will be true once all fields are "valid" (time to enable the submit button)
  values: { // will be in the sanitized and formatted form
    number: undefined,
    expiry: undefined,
    cvc: undefined,
    type: undefined,
    name: undefined,
    postalCode: undefined,
  },
  status: {  // will be one of ["incomplete", "invalid", and "valid"]
    number: "incomplete",
    expiry: "incomplete",
    cvc: "incomplete",
    name: "incomplete",
    postalCode: "incomplete",
  },
}) {}

export default function (addCreditCardState = new AddCreditCardData(), action) {
  switch (getActionType(action)) {
    case CC_SET_DATA:
      return new AddCreditCardData(action.data);
    default:
      return addCreditCardState;
  }
}

export function setCreditCard(data) {
  return {
    type: CC_SET_DATA,
    data,
  };
}

export function clearCreditCard() {
  return {
    type: CC_CLEAR,
  };
}

