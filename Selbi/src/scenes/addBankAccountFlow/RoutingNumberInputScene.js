import { connect } from 'react-redux';

import InputScene from '../InputScene';
import { setBankRouting } from '../../reducers/AddBankAccountReducer';

const mapStateToProps = (state) => {
  return {
    isNumeric: true,
    isNumericString: true,
    inputValue: state.addBank.routingNumber,
    inputTitle: 'What is the bank routing number?',
    placeholder: '110000000',
    validateInputOnSubmit: (input) => (input.length === 9),
    validateFormatSuggestion: 'Input must be a 9 digit bank routing number.',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recordInput: (value) => {
      dispatch(setBankRouting(value));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputScene);
