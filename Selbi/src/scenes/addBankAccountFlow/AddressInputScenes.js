import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';

import InputScene from '../InputScene';
import { setAddressLine1, setAddressLine2, setAddressCity, setAddressPostal, setAddressState }
  from '../../reducers/AddBankAccountReducer';


export default undefined;

function Title({ boldRow, bankData }) {
  const getStyle = (rowName) => {
    if (boldRow === rowName) {
      return { fontWeight: 'bold' };
    }
    return {};
  };
  return (
    <Text>
      <Text>What is the bank account owner's address?</Text>
      <Text>{'\n\n'}</Text>
      <Text style={getStyle('line1')}>
        {bankData.addressLine1 ? bankData.addressLine1 : 'Line 1'}{'\n'}
      </Text>
      <Text style={getStyle('line2')}>
        {bankData.addressLine2 ? bankData.addressLine2 : 'Line 2'}{'\n'}
      </Text>
      <Text style={getStyle('city')}>
        {bankData.addressCity ? bankData.addressCity : 'City'}{'\n'}
      </Text>
      <Text style={getStyle('state')}>
        {bankData.addressState ? bankData.addressState : 'State'}{'\n'}
      </Text>
      <Text style={getStyle('postal')}>
        {bankData.addressPostalCode ? bankData.addressPostalCode : 'Postal Code'}{'\n'}
      </Text>
    </Text>
  );
}
Title.propTypes = {
  boldRow: React.PropTypes.oneOf(['line1', 'line2', 'city', 'postal', 'state']),
  bankData: React.PropTypes.object.isRequired,
};

export const Line1InputScene = connect(
  (state) => {
    return {
      inputValue: state.addBank.addressLine1,
      inputTitle: <Title boldRow="line1" bankData={state.addBank} />,
      placeholder: '655 Natoma Street',
    };
  },
  (dispatch) => {
    return {
      recordInput: (value) => dispatch(setAddressLine1(value)),
    };
  }
)(InputScene);

export const Line2InputScene = connect(
  (state) => {
    return {
      allowEmpty: true,
      inputValue: state.addBank.addressLine2,
      inputTitle: <Title boldRow="line2" bankData={state.addBank} />,
      placeholder: 'Apt C',
    };
  },
  (dispatch) => {
    return {
      recordInput: (value) => dispatch(setAddressLine2(value)),
    };
  }
)(InputScene);

export const CityInputScene = connect(
  (state) => {
    return {
      inputValue: state.addBank.addressCity,
      inputTitle: <Title boldRow="city" bankData={state.addBank} />,
      placeholder: 'San Francisco',
    };
  },
  (dispatch) => {
    return {
      recordInput: (value) => dispatch(setAddressCity(value)),
    };
  }
)(InputScene);

export const PostalInputScene = connect(
  (state, p) => {
    console.log(p.routeLinks)
    return {
      isNumeric: true,
      isNumericString: true,
      inputValue: state.addBank.addressPostalCode,
      inputTitle: <Title boldRow="postal" bankData={state.addBank} />,
      placeholder: '94103',
      validateInputOnSubmit: (input) => (input.length === 5),
      validateFormatSuggestion: 'Input must be a 5 postal code.',
    };
  },
  (dispatch) => {
    return {
      recordInput: (value) => dispatch(setAddressPostal(value)),
    };
  }
)(InputScene);

export const StateInputScene = connect(
  (state, p) => {
    console.log(p.routeLinks)
    return {
      inputValue: state.addBank.addressState,
      inputTitle: <Title boldRow="state" bankData={state.addBank} />,
      placeholder: 'CA',
      validateInputOnSubmit: (input) => (input.length === 2),
      validateFormatSuggestion: 'Input must be the 2 letter abreviation for a state.',
    };
  },
  (dispatch) => {
    return {
      recordInput: (value) => dispatch(setAddressState(value)),
    };
  }
)(InputScene);

