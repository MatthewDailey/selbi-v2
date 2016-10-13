import { connect } from 'react-redux';

import InputScene from '../InputScene';
import { setSsn } from '../../reducers/AddBankAccountReducer';

const mapStateToProps = (state) => {
  return {
    isNumeric: true,
    isNumericString: true,
    inputValue: state.addBank.ssn,
    inputTitle: 'What are the last 4 digits of the bank account owner\'s SSN?',
    placeholder: '0000',
    validateInputOnSubmit: (input) => (input.length === 4),
    validateFormatSuggestion: 'Input must be a 4 digits.',
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
