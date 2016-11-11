import React from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';

import { setUpdateEmail } from '../../reducers/UpdateEmailReducer';

import InputScene from '../InputScene';
import SpinnerOverlay from '../../components/SpinnerOverlay';

import { updateEmail } from '../../firebase/FirebaseConnector';

import styles from '../../../styles';

class NewEmailInputScene extends InputScene {
  constructor(props) {
    super(props);

    this.state = {
      savingEmail: false,
    };
  }

  shouldGoNext() {
    if (super.shouldGoNext()) {
      this.setState({ savingEmail: true }, () => {
        updateEmail(this.props.inputValue)
          .then(() => this.setState({ savingEmail: false },
            () => this.goBack()))
          .catch((error) => {
            this.setState({ savingEmail: false });
            Alert.alert('Error Updating Email', error.message);
          });
      });
    }
    return false;
  }

  renderWithNavBar() {
    return (
      <View style={styles.container}>
        {super.renderWithNavBar()}
        <SpinnerOverlay isVisible={this.state.savingEmail} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    inputValue: state.updateEmail,
    inputTitle: 'What\'s your email?',
    placeholder: 'Email',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recordInput: (value) => {
      dispatch(setUpdateEmail(value));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewEmailInputScene);
