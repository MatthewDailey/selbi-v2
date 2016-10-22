import Immutable from 'immutable';
import { getActionType } from './ActionUtils';

const BA_CLEAR = 'clear-bank-account-entry';
const BA_SET_LEGAL_NAME = 'bank-account-set-legal-name';

const BA_SET_DOB = 'bank-account-set-dob';

const BA_SET_EMAIL = 'bank-account-set-email';

const BA_SET_ADDRESS_LINE1 = 'bank-account-set-address-line1';
const BA_SET_ADDRESS_LINE2 = 'bank-account-set-address-line2';
const BA_SET_ADDRESS_CITY = 'bank-account-set-address-city';
const BA_SET_ADDRESS_POSTAL = 'bank-account-set-address-postal';
const BA_SET_ADDRESS_STATE = 'bank-account-set-address-state';

const BA_SET_BANK_ROUTING = 'bank-account-set-routing';
const BA_SET_BANK_ACCOUNT = 'bank-account-set-account';

const BA_SET_SSN = 'bank-account-set-ssn';

class AddBankAccountData extends Immutable.Record({
  legalName: undefined,
  dobYear: 1990,
  dob: new Date(1990, 0, 1),
  addressLine1: undefined,
  addressLine2: undefined,
  addressCity: undefined,
  addressPostalCode: undefined,
  addressState: undefined,
  routingNumber: undefined,
  accountNumber: undefined,
  ssn: undefined,
  email: undefined,
}) {}

export default function (previousState = new AddBankAccountData(), action) {
  switch (getActionType(action)) {
    case BA_CLEAR:
      return new AddBankAccountData();

    case BA_SET_LEGAL_NAME:
      return previousState.merge({ legalName: action.legalName });

    case BA_SET_DOB:
      return previousState.merge({
        dob: action.dob,
      });

    case BA_SET_EMAIL:
      return previousState.merge({
        email: action.email,
      });

    case BA_SET_ADDRESS_LINE1:
      return previousState.merge({ addressLine1: action.line });
    case BA_SET_ADDRESS_LINE2:
      return previousState.merge({ addressLine2: action.line });
    case BA_SET_ADDRESS_CITY:
      return previousState.merge({ addressCity: action.city });
    case BA_SET_ADDRESS_POSTAL:
      return previousState.merge({ addressPostalCode: action.postal });
    case BA_SET_ADDRESS_STATE:
      return previousState.merge({ addressState: action.state });

    case BA_SET_BANK_ROUTING:
      return previousState.merge({ routingNumber: action.number });
    case BA_SET_BANK_ACCOUNT:
      return previousState.merge({ accountNumber: action.number });

    case BA_SET_SSN:
      return previousState.merge({ ssn: action.ssn });

    default:
      return previousState;
  }
}

export function clearBankAccount() {
  return {
    type: BA_CLEAR,
  };
}

export function setLegalName(legalName) {
  return {
    type: BA_SET_LEGAL_NAME,
    legalName,
  };
}

export function setDob(dob) {
  return {
    type: BA_SET_DOB,
    dob,
  };
}

export function setEmail(email) {
  return {
    type: BA_SET_EMAIL,
    email,
  };
}

export function setAddressLine1(line) {
  return {
    type: BA_SET_ADDRESS_LINE1,
    line,
  };
}

export function setAddressLine2(line) {
  return {
    type: BA_SET_ADDRESS_LINE2,
    line,
  };
}

export function setAddressCity(city) {
  return {
    type: BA_SET_ADDRESS_CITY,
    city,
  };
}

export function setAddressPostal(postal) {
  return {
    type: BA_SET_ADDRESS_POSTAL,
    postal,
  };
}

export function setAddressState(state) {
  return {
    type: BA_SET_ADDRESS_STATE,
    state,
  };
}

export function setBankRouting(number) {
  return {
    type: BA_SET_BANK_ROUTING,
    number,
  };
}

export function setBankAccount(number) {
  return {
    type: BA_SET_BANK_ACCOUNT,
    number,
  };
}

export function setSsn(ssn) {
  return {
    type: BA_SET_SSN,
    ssn,
  };
}
