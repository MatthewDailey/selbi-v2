import React, { Component } from 'react';
import { TouchableHighlight, View, Text } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import Permissions from 'react-native-permissions';

import styles from '../../../styles';
import colors from '../../../colors';

const FlatButton = MKButton.flatButton()
  .withBackgroundColor(colors.white)
  .build();

export default class AskForPermissionComponent extends Component {
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, padding: 25 }}>
          <Text style={styles.friendlyText}>
            Selbi requires {this.props.requestedPermission} permission.
          </Text>
          <View style={styles.padded} />
          <Text style={styles.friendlyText}>Tap to give permission settings.</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TouchableHighlight><Text>Skip</Text></TouchableHighlight>
          <FlatButton style={{ flex: 1, height: 48 }}><Text style={{ textAlign: 'center', alignContent: 'center' }}>Grant Permission</Text></FlatButton>
        </View>
      </View>
    );
  }
}

AskForPermissionComponent.propTypes = {
  requestedPermission: React.PropTypes.string.isRequired,
};
