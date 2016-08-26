import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { mdl, MKButton, setTheme } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../../styles';
import colors from '../../colors';
import RoutableScene from '../nav/RoutableScene';

setTheme({
  primaryColor: colors.primaryColor,
});

var ScrollableTabView = require('react-native-scrollable-tab-view');

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
    console.log(this.props.store.getState());

    const getInnerView = (isRegister) => {
      const registerOrSignIn = isRegister ? 'Register' : 'Sign in';
      const SubmitButton = MKButton.coloredFlatButton()
        .withText(registerOrSignIn)
        .withOnPress(() => {
          this.goNext();
          console.log(`Clicked ${registerOrSignIn}`);
        })
        .build();

      const FacebookButton = MKButton.button()
        .withStyle({
          borderRadius: 5,
        })
        .withBackgroundColor('#3b5998')
        .build()
      const GoogleButton = MKButton.button()
        .withStyle({
          borderRadius: 5,
        })
        .withBackgroundColor(colors.white)
        .build()

      const scrollToBottom = () => {
        console.log("focused email input");
        this.scrollView.scrollTo({ x:0, y:150, animated:true });
      };

      console.log(MKButton.button())
      return (
        <View style={styles.padded}>
          <FacebookButton >
            <Text style={{ color: colors.white }}><Icon name="facebook" size={16} />  {`${registerOrSignIn} with Facebook`}</Text>
          </FacebookButton>
          <View style={styles.halfPadded} />
          <GoogleButton>
            <Text style={{ color: 'grey' }}><Icon name="google" size={16} />  {`${registerOrSignIn} with Google`}</Text>
          </GoogleButton>
          <View style={styles.padded} />
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: `${colors.secondary}64`,
            }}
          />
          <View style={styles.padded} />
          <Text
            style={{
              textAlign: 'center',
            }}
          >
            {`${registerOrSignIn} with email and password.`}
          </Text>
          <EmailInput
            onFocus={scrollToBottom}
          />
          <PasswordInput />
          <View style={styles.padded} />
          <SubmitButton />
        </View>
      );
    };

    return (
      <ScrollableTabView
        tabBarBackgroundColor={colors.primary}
        tabBarUnderlineColor={colors.secondary}
        tabBarActiveTextColor={colors.secondary}
        style={styles.fullScreenContainer}
      >
        <ScrollView ref={(r) => this.scrollView = r} style={styles.fullScreenContainer} tabLabel="Sign In" >
          {getInnerView(false)}
        </ScrollView>
        <ScrollView ref={(r) => this.scrollView = r} style={styles.fullScreenContainer} tabLabel="Register" >
          {getInnerView(true)}
        </ScrollView>
      </ScrollableTabView>
    );
  }
}


