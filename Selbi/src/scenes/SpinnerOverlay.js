import React from 'react';
import { Text, View } from 'react-native';
import { MKSpinner } from 'react-native-material-kit';
// noinspection Eslint - Dimensions provided by react-native env.
import Dimensions from 'Dimensions';

import styles from '../../styles';
import colors from '../../colors';

export default function SpinnerOverlay({ isVisible, message }) {
  if (isVisible) {
    const { width, height } = Dimensions.get('window');

    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: height,
          width: width,
          backgroundColor: `${colors.dark}aa`,
        }}
      >
        <View style={styles.paddedCenterContainerClear}>
          <MKSpinner />
          <Text
            color={colors.white}
            style={styles.friendlyText}
          >
            {message}
          </Text>
        </View>
      </View>
    );
  }
  return <View />;
}