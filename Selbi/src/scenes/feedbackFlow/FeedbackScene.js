import React from 'react';
import { connect } from 'react-redux';
import { Alert, View, Text, TextInput } from 'react-native';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import RoutableScene from '../../nav/RoutableScene';

import { setFeedbackEmail, setFeedbackMessage } from '../../reducers/FeedbackReducer';

import styles from '../../../styles';

class FeedbackScene extends RoutableScene {
  shouldGoNext() {
    if (!this.props.email) {
      Alert.alert('Missing email', 'You must include an email so we can respond to you.');
      return false;
    }
    if (!this.props.message) {
      Alert.alert('Missing message',
        'You must include a message so we know what we can do to help.');
      return false;
    }
    return true;
  }

  renderWithNavBar() {
    return (
      <View style={styles.padded}>
        <Text style={{ fontWeight: 'bold' }}>Your Email</Text>
        <TextInput
          placeholder="Email"
          style={[styles.friendlyTextLeft, { height: 40 }]}
          value={this.props.email}
          onChangeText={this.props.recordEmail}
        />
        <Text style={{ fontWeight: 'bold' }}>Message</Text>
        <AutoGrowingTextInput
          placeholder="Message"
          style={styles.friendlyTextLeft}
          value={this.props.message}
          onChangeText={this.props.recordMessage}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    email: state.feedback.email,
    message: state.feedback.message,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recordEmail: (value) => dispatch(setFeedbackEmail(value)),
    recordMessage: (value) => dispatch(setFeedbackMessage(value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedbackScene);

