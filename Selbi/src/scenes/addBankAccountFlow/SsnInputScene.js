import { connect } from 'react-redux';

import InputScene from '../InputScene';
import { setSsn } from '../../reducers/AddBankAccountReducer';

const mapStateToProps = (state) => {
  return {
    isNumeric: true,
    isNumericString: true,
    inputValue: state.addBank.ssn,
    inputTitle: 'What is the bank account owner\'s SSN or EIN?',
    placeholder: '000000000',
    validateInputOnSubmit: (input) => (input.length === 9),
    validateFormatSuggestion: 'Input must be a 9 digit SSN or EIN.',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recordInput: (value) => {
      dispatch(setSsn(value));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputScene);
