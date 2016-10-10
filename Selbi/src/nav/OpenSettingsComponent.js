import React from 'react';
import { TouchableHighlight, View, Text } from 'react-native';
import Permissions from 'react-native-permissions';

import styles from '../../styles';

export default function OpenSettingsComponent({ missingPermission }) {
  return (
    <TouchableHighlight onPress={Permissions.openSettings}>
      <View style={styles.paddedContainer}>
        <Text style={styles.friendlyText}>Selbi requires {missingPermission} permission.</Text>
        <View style={styles.padded} />
        <Text style={styles.friendlyText}>Tap to open settings.</Text>
      </View>
    </TouchableHighlight>
  );
}

OpenSettingsComponent.propTypes = {
  missingPermission: React.PropTypes.string.isRequired,
};
