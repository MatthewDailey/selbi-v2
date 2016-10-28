import React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import colors from '../../colors';

export default function FlagContentButton({ listingId }) {
  return (
    <TouchableHighlight
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        alignItems: 'center',
        paddingTop: 32,
        paddingRight: 8,
        height: 64,
        width: 48,
        opacity: 0.7,
      }}
      onPress={() => console.log('Pressed flag content', listingId)}
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
        <Icon name="flag-o" size={18} color={colors.secondary} />
      </Text>
    </TouchableHighlight>
  );
}
FlagContentButton.propTypes = {
  listingId: React.PropTypes.string.isRequired,
};

