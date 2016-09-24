import React from 'react';
import { Text, View } from 'react-native';
import { MKSpinner } from 'react-native-material-kit';
// noinspection Eslint - Dimensions provided by react-native env.
import Dimensions from 'Dimensions';

import styles from '../../styles';
import colors from '../../colors';

export default function SpinnerOverlay({ isVisible, message, backgroundColor = colors.dark }) {
  if (isVisible) {
    const { width, height } = Dimensions.get('window');

    const backgroundStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      height,
      width,
    };

    if (backgroundColor) {
      backgroundStyle.backgroundColor = `${backgroundColor}aa`;
    }

    return (
      <View style={backgroundStyle}>
        <View style={styles.paddedCenterContainerClear}>
          <MKSpinner strokeColor={colors.primary} />
          <Text
            color={colors.white}
            style={styles.friendlyTextLight}
          >
            {message}
          </Text>
        </View>
      </View>
    );
  }
  return <View />;
}