import { connect } from 'react-redux';

import InputScene from '../InputScene';
import { setPhoneCode } from '../../reducers/AddFriendsFromContactsReducer';
import { enqueuePhoneCode } from '../../firebase/FirebaseConnector';

const mapStateToProps = (state) => {
  return {
    isNumeric: true,
    isNumericString: true,
    inputValue: state.addPhone.code,
    phoneNumber: state.addPhone.number,
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
    enqueuePhoneCode(this.props.phoneNumber, this.props.inputValue);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnterPhoneCodeScene);
