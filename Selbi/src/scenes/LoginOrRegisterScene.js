import React from 'react';
import { View } from 'react-native';
import { mdl, MKButton, setTheme } from 'react-native-material-kit';

import styles from '../../styles';
import colors from '../../colors';

setTheme({
  primaryColor: colors.primaryColor,
});

const PasswordInput = mdl.Textfield.textfieldWithFloatingLabel()
  .withPassword(true)
  .withPlaceholder('Password')
  .withHighlightColor(colors.white)
  .withStyle({
    height: 48,  // have to do it on iOS
    marginTop: 10,
  })
  .withOnTextChange((e) => console.log('TextChange', e))
  .build();

const EmailInput = mdl.Textfield.textfieldWithFloatingLabel()
  .withPlaceholder('Email')
  .withHighlightColor(colors.white)
  .withStyle({
    height: 48,  // have to do it on iOS
    marginTop: 10,
  })
  .withOnTextChange((e) => console.log('TextChange', e))
  .build();

const SubmitButton = MKButton.coloredFlatButton()
  .withText('Submit')
  .withOnPress(() => {
    console.log("Hi, it's a colored button!");
  })
  .build();

export default function LoginOrRegisterScene() {
  return (
    <View style={styles.fullScreenContainer}>
      <View style={{ margin: 16 }}>
        <EmailInput />
        <PasswordInput />
        <View style={{ margin: 16 }}>
          <SubmitButton />
        </View>
      </View>
    </View>
  );
}
//
// LoginOrRegisterScene.propTypes = {
//   // TODO
// };
