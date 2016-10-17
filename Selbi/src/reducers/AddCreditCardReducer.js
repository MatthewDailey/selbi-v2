import Immutable from 'immutable';
import { getActionType } from './ActionUtils';

const CC_SET_DATA = 'set-credit-card-number';
const CC_SET_EMAIL = 'set-credot-card-email';
const CC_CLEAR = 'clear-credit-card';

export const AddCreditCardStatus = {
  enteringData: 'entering-data',
  gettingKey: 'Storing credit card with Stripe',
  creatingAccount: 'Creating account to Selbi',
  success: 'success',
  failure: 'failure',
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
    number: 'incomplete',
    expiry: 'incomplete',
    cvc: 'incomplete',
    name: 'incomplete',
    postalCode: 'incomplete',
  },
  email: undefined,
}) {}

export default function (addCreditCardState = new AddCreditCardData(), action) {
  switch (getActionType(action)) {
    case CC_SET_DATA:
      return addCreditCardState.merge(action.data);
    case CC_SET_EMAIL:
      return addCreditCardState.merge({ email: action.email });
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

export function setCreditCardEmail(email) {
  return {
    type: CC_SET_EMAIL,
    email,
  }
}

export function clearCreditCard() {
  return {
    type: CC_CLEAR,
  };
}

