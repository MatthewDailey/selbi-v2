import { connect } from 'react-redux';

import InputScene from '../InputScene';
import { setPhoneCode } from '../../reducers/AddFriendsFromContactsReducer';

const mapStateToProps = (state) => {
  return {
    isNumeric: true,
    isNumericString: true,
    inputValue: state.addPhone.code,
    inputTitle: 'What is the 4 digit code we sent you?',
    placeholder: '1234',
    validateInputOnSubmit: (input) => (input.length === 4),
    validateFormatSuggestion: 'Input must be a 4 digits.',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recordInput: (value) => {
      dispatch(setPhoneCode(value));
    },
  };
};

class EnterPhoneCodeScene extends InputScene {
  onGoNext() {
    // TODO: enqueue verification code attempt.
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputScene);
