import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import RoutableScene from '../../nav/RoutableScene';

import styles from '../../../styles';

class CompletedFeedbackScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <View style={styles.padded}>
        <Text style={styles.friendlyTextLeft}>
          Thank you for your feedback! It means a lot to us.
        </Text>
        <View style={styles.halfPadded} />
        <Text style={styles.friendlyText}>
          <Icon name="smile-o" size={30} />
        </Text>
        <View style={styles.halfPadded} />
        <Text style={styles.friendlyTextLeft}>
          You'll receive an email to {this.props.email} which includes our team on the 'To'
          line.
        </Text>
        <View style={styles.halfPadded} />
        <Text style={styles.friendlyTextLeft}>
          We'll follow up with you on that email thread shortly.
        </Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    email: state.feedback.email,
  };
};

export default connect(
  mapStateToProps,
  undefined
)(CompletedFeedbackScene);

