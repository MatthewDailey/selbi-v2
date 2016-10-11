import { connect } from 'react-redux';

import InputScene from '../InputScene';
import { setEmail } from '../../reducers/AddBankAccountReducer';
import { getUser } from '../../firebase/FirebaseConnector';

const mapStateToProps = (state) => {
  let email = state.addBank.email;
  if (!email && getUser()) {
    email = getUser().email;
  }

  return {
    inputValue: email,
    inputTitle: 'Is this the correct email?',
    placeholder: 'Email',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recordInput: (value) => {
      dispatch(setEmail(value));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputScene);
