import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput } from 'react-native';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import RoutableScene from '../../nav/RoutableScene';

import { setFeedbackEmail, setFeedbackMessage } from '../../reducers/FeedbackReducer';

import styles from '../../../styles';

class FeedbackScene extends RoutableScene {
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

