import React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import colors from '../../colors';

export default function TopLeftBackButton({ onPress }) {
  return (
    <TouchableHighlight
      style={{
        alignItems: 'center',
        paddingTop: 32,
        paddingLeft: 8,
        height: 64,
        width: 48,
        opacity: 0.7,
      }}
      onPress={onPress}
      underlayColor={colors.transparent}
      activeOpacity={0.5}
    >
      <Text
        style={{
          textShadowColor: colors.dark,
          textShadowOffset: {
            width: 1,
            height: 1,
          },
          textShadowRadius: 2,
        }}
      >
        <Icon name="chevron-left" size={18} color={colors.secondary} />
      </Text>
    </TouchableHighlight>
  );
}

