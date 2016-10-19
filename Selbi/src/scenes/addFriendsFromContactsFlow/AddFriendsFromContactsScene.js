import React from 'react';
import { connect } from 'react-redux';
import { InteractionManager, View, Text } from 'react-native';

import { MKButton } from 'react-native-material-kit';

import { awaitPhoneVerification, followPhoneNumbers, updateBulletin } from '../../firebase/FirebaseConnector';
import { normalizePhoneNumber, loadAllContactsPhoneNumber } from './utils';

import RoutableScene from '../../nav/RoutableScene';
import SpinnerOverlay from '../../components/SpinnerOverlay';

import styles, { paddingSize } from '../../../styles';

const SubmitButton = MKButton
  .button()
  .withStyle({
    borderRadius: 5,
    padding: paddingSize,
  })
  .withText('Follow Contacts')
  .build();

function VerifiedCodeComponent({ followContacts }) {
  return (
    <View sylte={styles.paddedCenterContainer}>
      <Text style={styles.friendlyText}>
        Successfully verified your phone!
      </Text>
      <View style={styles.halfPadded} />
      <Text style={styles.friendlyText}>
        Follow people in your contact book to see what your friends are selling.
      </Text>
      <View style={styles.halfPadded} />
      <SubmitButton onPress={followContacts} />
    </View>
  );
}

function AddedFriendsComponent({ numFriends }) {
  return (
    <View sylte={styles.paddedCenterContainer}>
      <Text style={styles.friendlyText}>
        Added {numFriends} friend from your phone book.
      </Text>
      <View style={styles.halfPadded} />
      <Text style={styles.friendlyText}>
        Your contacts will also be able to follow you based on your phone number.
      </Text>
    </View>
  );
}

function FailureComponent({ message }) {
  return (
    <View sylte={styles.paddedCenterContainer}>
      <Text style={styles.friendlyText}>
        {message}
      </Text>
    </View>
  );
}

class AddFriendsFromContactsScene extends RoutableScene {
  constructor(props) {
    super(props);
    this.addFriendsFromPhoneBook = this.addFriendsFromPhoneBook.bind(this);

    this.state = {
      view: <SpinnerOverlay isVisible message="Waiting for code verification..." />,
    };
  }

  addFriendsFromPhoneBook() {
    const success = (numFriends) => {
      this.setState({
        view: <AddedFriendsComponent numFriends={numFriends} />,
      });

      Object.keys(this.props.bulletins).forEach((key) => {
        if (this.props.bulletins[key].type === 'should-add-phone') {
          updateBulletin(key, { status: 'read' });
        }
      });
    };

    const error = (error) => this.setState({
      view: <FailureComponent message={error} />,
    });

    this.setState({
      view: <SpinnerOverlay message="Adding friends from contacts..." />,
    }, () => {
      loadAllContactsPhoneNumber()
        .then(followPhoneNumbers)
        .then(success)
        .catch(error);
    });
  }

  componentDidMount() {
    awaitPhoneVerification(normalizePhoneNumber(this.props.phoneNumber))
      .then(() => {
        this.setState({
          view: <VerifiedCodeComponent followContacts={this.addFriendsFromPhoneBook} />,
        });
      })
      .catch((error) => {
        this.setState({
          view: <FailureComponent message={`Failed to verified your phone. ${error}`} />,
        });
      });
  }

  renderWithNavBar() {
    return (
      <View style={styles.paddedContainer}>
        {this.state.view}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    phoneNumber: state.addPhone.number,
    bulletins: state.bulletins,
  };
}

export default connect(
  mapStateToProps,
  undefined
)(AddFriendsFromContactsScene);
