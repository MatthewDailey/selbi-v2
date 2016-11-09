import React from 'react';
import { TouchableHighlight, View } from 'react-native';

import colors from '../../../colors';
import styles from '../../../styles';

export default function FlatButton({
  onPress,
  children,
  borderWidth = 1,
  underlayColor = colors.primary,
  backgroundColor = colors.white,
}) {
  return (
    <TouchableHighlight
      underlayColor={underlayColor}
      onPress={onPress}
      style={
        [
          styles.halfPadded,
          {
            borderRadius: 5,
            borderWidth,
            backgroundColor,
          },
        ]
      }
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
  borderWidth: React.PropTypes.number,
  onPress: React.PropTypes.func,
  children: React.PropTypes.element,
  backgroundColor: React.PropTypes.string,
  underlayColor: React.PropTypes.string,
};
