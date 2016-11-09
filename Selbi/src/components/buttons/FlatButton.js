import React from 'react';
import { TouchableHighlight, View } from 'react-native';
import { MKButton } from 'react-native-material-kit';

import colors from '../../../colors';
import styles from '../../../styles';

export function FlatButton({
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
}

FlatButton.propTypes = {
  borderWidth: React.PropTypes.number,
  onPress: React.PropTypes.func,
  children: React.PropTypes.element,
  backgroundColor: React.PropTypes.string,
  underlayColor: React.PropTypes.string,
};

export default function Button({
  onPress,
  children,
  borderWidth = 1,
  underlayColor = colors.primary,
  backgroundColor = colors.white,
}) {

  return (
    <MKButton
      style={
        [
          styles.halfPadded,
          {
            borderRadius: 5,
            borderWidth,
            backgroundColor,
            overflow: 'hidden',
          },
        ]
      }
      rippleColor={`${underlayColor}64`}
      maskBorderRadius={5}
      onPress={onPress}
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
    </MKButton>
  );
}

Button.propTypes = {
  borderWidth: React.PropTypes.number,
  onPress: React.PropTypes.func,
  children: React.PropTypes.element,
  backgroundColor: React.PropTypes.string,
  underlayColor: React.PropTypes.string,
};
