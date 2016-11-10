import { connect } from 'react-redux';

import InputScene from '../InputScene';
import { setCreditCardEmail } from '../../reducers/AddCreditCardReducer';
import { getUser } from '../../firebase/FirebaseConnector';

const mapStateToProps = (state) => {
  let email = state.addCreditCard.email;
  if (email === undefined && getUser()) {
    email = getUser().email;
  }

  return {
    inputValue: email,
    inputTitle: 'What email would you like to receive payment notifications?',
    placeholder: 'Email',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recordInput: (value) => {
      dispatch(setCreditCardEmail(value));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputScene);
