import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';

import InputScene from '../InputScene';
import { setDobMonth, setDobDay, setDobYear } from '../../reducers/AddBankAccountReducer';

export default undefined;

const Title = ({ denomination, bankData }) => {
  const getStyle = (rowName) => {
    if (denomination === rowName) {
      return { fontWeight: 'bold' };
    }
    return {};
  };

  return (
    <Text>
      <Text>What is the bank account owner's </Text>
      <Text style={{ fontWeight: 'bold' }}>{denomination}</Text>
      <Text> of birth?</Text>
      <Text>{'\n\n'}</Text>
      <Text>
        <Text style={getStyle('month')}>{bankData.dobMonth ? bankData.dobMonth : 'MM'}</Text>
        <Text>/</Text>
        <Text style={getStyle('day')}>{bankData.dobDay ? bankData.dobDay : 'DD'}</Text>
        <Text>/</Text>
        <Text style={getStyle('year')}>{bankData.dobYear ? bankData.dobYear : 'YYYY'}</Text>
      </Text>
    </Text>
  );
};

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
      inputTitle: <Title denomination="month" bankData={state.addBank} />,
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

export const DayInputScene = connect(
  (state) => {
    return {
      isNumeric: true,
      isInt: true,
      inputValue: state.addBank.dobDay,
      inputTitle: <Title denomination="day" bankData={state.addBank} />,
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

export const YearInputScene = connect(
  (state) => {
    return {
      isNumeric: true,
      isInt: true,
      inputValue: state.addBank.dobYear,
      inputTitle: <Title denomination="year" bankData={state.addBank} />,
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
