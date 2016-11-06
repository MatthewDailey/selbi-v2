import React, { Component } from 'react';
import { TouchableHighlight, View, Text } from 'react-native';
import Permissions from 'react-native-permissions';

import styles from '../../../styles';

export default class AskForPermissionComponent extends Component {
  render() {
    return (
      <TouchableHighlight
        onPress={() => Permissions.requestPermission(this.props.requestedPermission)}
      >
        <View style={styles.paddedContainer}>
          <Text style={styles.friendlyText}>
            Selbi requires {this.props.requestedPermission} permission.
          </Text>
          <View style={styles.padded} />
          <Text style={styles.friendlyText}>Tap to give permission settings.</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

AskForPermissionComponent.propTypes = {
  requestedPermission: React.PropTypes.string.isRequired,
};
