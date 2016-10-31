import React from 'react';
import { Text, View } from 'react-native';
import { MKSpinner } from 'react-native-material-kit';
// noinspection Eslint - Dimensions provided by react-native env.
import Dimensions from 'Dimensions';

import styles from '../../styles';
import colors from '../../colors';

export default function SpinnerOverlay({
  isVisible,
  message,
  messageVerticalOffset = 0,
  backgroundColor = colors.dark,
  fillParent = false }) {
  if (isVisible) {
    const { width, height } = Dimensions.get('window');

    const backgroundStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      height,
      width,
      backgroundColor: `${backgroundColor}aa`,
    };

    if (fillParent) {
      return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            flex: 1,
            backgroundColor: `${backgroundColor}aa`,
          }}
        >
          <View style={{ paddingTop: messageVerticalOffset }} />
          <View style={styles.paddedCenterContainerClear}>
            <MKSpinner strokeColor={colors.primary} />
            <Text color={colors.white} style={styles.friendlyTextLight}>{message}</Text>
          </View>
        </View>
      );
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

SpinnerOverlay.propTypes = {
  isVisible: React.PropTypes.any,
  message: React.PropTypes.node,
  messageVerticalOffset: React.PropTypes.number,
  backgroundColor: React.PropTypes.string,
  fillParent: React.PropTypes.bool,
};
