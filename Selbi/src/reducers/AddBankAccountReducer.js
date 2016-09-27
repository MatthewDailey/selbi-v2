import Immutable from 'immutable';
import { getActionType } from './ActionUtils';

const BA_CLEAR = 'clear-bank-account-entry';
const BA_SET_LEGAL_NAME = 'bank-account-set-legal-name';
const BA_SET_DOB_MONTH = 'bank-account-set-dob-month';
const BA_SET_DOB_DAY = 'bank-account-set-dob-day';
const BA_SET_DOB_YEAR = 'bank-account-set-dob-year';

class AddBankAccountData extends Immutable.Record({
  legalName: undefined,
  dobDay: undefined,
  dobMonth: undefined,
  dobYear: undefined,
  addressLine1: undefined,
  addressLine2: undefined,
  addressCity: undefined,
  addressPostalCode: undefined,
  addressState: undefined,
  routingNumber: undefined,
  accountNumber: undefined,
  ssn: undefined,
}) {}

export default function (previousState = new AddBankAccountData(), action) {
  console.log('------Got update to bank account--------');
  console.log(action);
  console.log(previousState)
  switch (getActionType(action)) {
    case BA_CLEAR:
      return new AddBankAccountData();
    case BA_SET_LEGAL_NAME:
      return previousState.merge({ legalName: action.legalName });
    case BA_SET_DOB_MONTH:
      return previousState.merge({ dobMonth: action.month });
    case BA_SET_DOB_DAY:
      return previousState.merge({ dobDay: action.day });
    case BA_SET_DOB_YEAR:
      return previousState.merge({ dobYear: action.year });
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

export function setDobDay(day) {
  return {
    type: BA_SET_DOB_DAY,
    day,
  };
}

export function setDobMonth(month) {
  return {
    type: BA_SET_DOB_MONTH,
    month,
  };
}

export function setDobYear(year) {
  return {
    type: BA_SET_DOB_YEAR,
    year,
  };
}
