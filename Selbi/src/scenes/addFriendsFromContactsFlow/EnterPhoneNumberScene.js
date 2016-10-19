import { connect } from 'react-redux';

import InputScene from '../InputScene';
import { setPhoneNumber } from '../../reducers/AddFriendsFromContactsReducer';
import { enqueuePhoneNumber } from '../../firebase/FirebaseConnector';
import { normalizePhoneNumber } from './utils';

const mapStateToProps = (state) => {
  return {
    isNumeric: true,
    isNumericString: true,
    inputValue: state.addPhone.number,
    inputTitle: 'What is your phone number? We\'ll text you a 4 digit code to verify.',
    placeholder: '123 456 7890',
    validateInputOnSubmit: (input) => !!normalizePhoneNumber(input),
    validateFormatSuggestion: 'Input must be a 10 digit US phone number.',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recordInput: (value) => {
      dispatch(setPhoneNumber(value));
    },
  };
};

class EnterPhoneNumberScene extends InputScene {
  onGoNext() {
    enqueuePhoneNumber(normalizePhoneNumber(this.props.inputValue));
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnterPhoneNumberScene);
