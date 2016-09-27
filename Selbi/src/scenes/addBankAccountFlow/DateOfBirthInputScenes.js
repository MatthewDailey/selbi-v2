import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';

import InputScene from '../InputScene';
import { setDobMonth, setDobDay, setDobYear } from '../../reducers/AddBankAccountReducer';

export default undefined;

const MonthTitle = () => (
  <Text>
    <Text>What is the bank account owner's </Text>
    <Text style={{ fontWeight: 'bold' }}>month</Text>
    <Text> of birth?</Text>
    <Text>{'\n\n'}</Text>
    <Text style={{ fontWeight: 'bold' }}>MM</Text>
    <Text>/DD/YYYY</Text>
  </Text>
);

export const MonthInputScene = connect(
  (state) => {
    return {
      isNumeric: true,
      isInt: true,
      inputValue: state.addBank.dobMonth,
      inputTitle: <MonthTitle />,
      placeholder: '3',
      validateInputOnSubmit: (input) => (parseInt(input, 10) > 0 && parseInt(input, 10) < 13),
      validateFormatSuggestion: 'Input must be between 1 and 12',
    };
  },
  (dispatch) => {
    return {
      recordInput: (value) => dispatch(setDobMonth(value)),
    };
  }
)(InputScene);

const DayTitle = () => (
  <Text>
    <Text>What is the bank account owner's </Text>
    <Text style={{ fontWeight: 'bold' }}>day</Text>
    <Text> of birth?</Text>
    <Text>{'\n\n'}MM/</Text>
    <Text style={{ fontWeight: 'bold' }}>DD</Text>
    <Text>/YYYY</Text>
  </Text>
);

export const DayInputScene = connect(
  (state) => {
    return {
      isNumeric: true,
      isInt: true,
      inputValue: state.addBank.dobDay,
      inputTitle: <DayTitle />,
      placeholder: '20',
      validateInputOnSubmit: (input) => (parseInt(input, 10) > 0 && parseInt(input, 10) < 32),
      validateFormatSuggestion: 'Input must be between 1 and 32',
    };
  },
  (dispatch) => {
    return {
      recordInput: (value) => dispatch(setDobDay(value)),
    };
  }
)(InputScene);

const YearTitle = () => (
  <Text>
    <Text>What is the bank account owner's </Text>
    <Text style={{ fontWeight: 'bold' }}>year</Text>
    <Text> of birth?</Text>
    <Text>{'\n\n'}MM/DD/</Text>
    <Text style={{ fontWeight: 'bold' }}>YYYY</Text>
  </Text>
);

export const YearInputScene = connect(
  (state) => {
    return {
      isNumeric: true,
      isInt: true,
      inputValue: state.addBank.dobYear,
      inputTitle: <YearTitle />,
      placeholder: '1990',
      validateInputOnSubmit: (input) => parseInt(input, 10) > 1900,
      validateFormatSuggestion: 'Input must be >1900',
    };
  },
  (dispatch) => {
    return {
      recordInput: (value) => dispatch(setDobYear(value)),
    };
  }
)(InputScene);
