import React from 'react';
import { View, Text } from 'react-native';
import { mdl, MKButton, setTheme } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../../styles';
import colors from '../../colors';
import RoutableScene from '../nav/RoutableScene';

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

export default class LoginOrRegisterScene extends RoutableScene {
  renderWithNavBar() {
    const SubmitButton = MKButton.coloredFlatButton()
      .withText('Submit')
      .withOnPress(() => {
        this.goNext();
        console.log("Hi, it's a colored button!");
      })
      .build();

    return (
      <View style={styles.fullScreenContainer}>
        <View style={{ margin: 16 }}>
          <Icon.Button name="facebook" backgroundColor="#3b5998" onPress={this.loginWithFacebook}>
            Sign in with Facebook
          </Icon.Button>
          <EmailInput />
          <PasswordInput />
          <View style={{ margin: 16 }}>
            <SubmitButton />
          </View>
        </View>
      </View>
    );
  }
}


