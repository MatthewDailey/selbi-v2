import React from 'react';
import { View, Text } from 'react-native';

import styles from '../../styles';
import colors from '../../colors';

export default function LoadingListingComponent({ message = 'Loading listing...' }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: `${colors.dark}`,
      }}
    >
      <View style={styles.paddedCenterContainerClear}>
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
