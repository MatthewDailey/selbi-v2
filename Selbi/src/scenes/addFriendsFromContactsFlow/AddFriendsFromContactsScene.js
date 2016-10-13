import React from 'react';
import { connect } from 'react-redux';
import { InteractionManager, View, Text } from 'react-native';

import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import { awaitPhoneVerification } from '../../firebase/FirebaseConnector';
import { normalizePhoneNumber } from './utils';

import RoutableScene from '../../nav/RoutableScene';
import SpinnerOverlay from '../../components/SpinnerOverlay';
import VisibilityWrapper from '../../components/VisibilityWrapper';

import styles, { paddingSize } from '../../../styles';

const SubmitButton = MKButton
  .button()
  .withStyle({
    borderRadius: 5,
    padding: paddingSize,
  })
  .withText('Follow Contacts')
  .build();

class AddFriendsFromContactsScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      awaitingCodeVerification: true,
      verificationSuccess: false,
      renderPlaceholderOnly: true,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false });
      awaitPhoneVerification(this.props.phoneNumber)
        .then(() => {
          this.setState({
            awaitingCodeVerification: false,
            verificationSuccess: true,
            message: 'Successfully verified your phone!',
          });
        })
        .catch((error) => {
          this.setState({
            awaitingCodeVerification: false,
            message: `Failed to verified your phone. ${error}`,
          });
        });
    });
  }

  renderWithNavBar() {
    return (
      <View style={styles.paddedContainer}>
        <Text style={styles.friendlyText}>{this.state.message}</Text>

        <VisibilityWrapper isVisible={this.state.verificationSuccess}>
          <View sylte={styles.paddedCenterContainer}>
            <Text style={styles.friendlyText}>
              Follow people in your contact book to see what your friends are selling.
            </Text>
            <SubmitButton />
          </View>
        </VisibilityWrapper>
        <SpinnerOverlay
          isVisible={this.state.awaitingCodeVerification}
          message="Waiting for code verification"
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    phoneNumber: normalizePhoneNumber(state.addPhone.number),
  };
}

export default connect(
  mapStateToProps,
  undefined
)(AddFriendsFromContactsScene);
