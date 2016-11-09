import React from 'react';
import { TouchableHighlight, View } from 'react-native';

import colors from '../../../colors';

export default function FlatButton({ onPress, children, backgroundColor = colors.white }) {
  return (
    <TouchableHighlight
      underlayColor={colors.primary}
      onPress={onPress}
      style={{
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          borderRadius: 5,
        }}
      >
        {children}
      </View>
    </TouchableHighlight>
  );
};

FlatButton.propTypes = {
  onPress: React.PropTypes.func,
  children: React.PropTypes.element,
  backgroundColor: React.PropTypes.string,
};
