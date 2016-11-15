import React from 'react';
import { View, Platform } from 'react-native';
import { MKRipple, MKButton } from 'react-native-material-kit';

import colors from '../../../colors';
import styles from '../../../styles';

// Note that we use MKRipple and it's onTouch rather than MKButton. This is because MKButton
// only triggers when the keyboard is hidden but MKRipple onTouch triggers regardless.
export default function Button({
  onPress,
  children,
  borderWidth = 1,
  underlayColor = colors.primary,
  backgroundColor = colors.white,
}) {

  if (Platform.OS === 'android') {
    const androidButton = MKButton.flatButton()
      .withStyle({
        borderRadius: 5,
        borderWidth,
        backgroundColor,
        overflow: 'hidden',
      })
      .withOnPress(onPress);
    return (
      <MKButton
        rippleColor={`${underlayColor}64`}
        maskBorderRadius={5}
        onTouch={(event) => {
          if (event.type === 'TOUCH_UP') {
            onPress();
          }
        }}
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

  return (
    <MKRipple
      rippleColor={`${underlayColor}64`}
      maskBorderRadius={5}
      onTouch={(event) => {
        if (event.type === 'TOUCH_UP') {
          onPress();
        }
      }}
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
    </MKRipple>
  );
}

Button.propTypes = {
  borderWidth: React.PropTypes.number,
  onPress: React.PropTypes.func,
  children: React.PropTypes.element,
  backgroundColor: React.PropTypes.string,
  underlayColor: React.PropTypes.string,
};
