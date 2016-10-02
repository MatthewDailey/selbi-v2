import { connect } from 'react-redux';

import InputScene from '../InputScene';
import { setBankAccount } from '../../reducers/AddBankAccountReducer';

const mapStateToProps = (state) => {
  return {
    isNumeric: true,
    isNumericString: true,
    inputValue: state.addBank.accountNumber,
    inputTitle: 'What is the bank account number?',
    placeholder: '000123456789',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recordInput: (value) => {
      dispatch(setBankAccount(value));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputScene);
