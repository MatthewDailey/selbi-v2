import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { mdl, MKButton, setTheme } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';

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
  .build();

const EmailInput = mdl.Textfield.textfieldWithFloatingLabel()
  .withPlaceholder('Email')
  .withHighlightColor(colors.white)
  .withStyle({
    height: 48,  // have to do it on iOS
    marginTop: 10,
  })
  .build();

const GoogleButton = MKButton.button()
  .withStyle({
    borderRadius: 5,
  })
  .withBackgroundColor(colors.white)
  .withOnPress(() => alert('Sorry, not yet supported.'))
  .build();

const FacebookButton = MKButton.button()
  .withStyle({
    borderRadius: 5,
  })
  .withOnPress(() => alert('Sorry, not yet supported.'))
  .withBackgroundColor('#3b5998')
  .build();

export default class LoginOrRegisterScene extends RoutableScene {
  constructor(props) {
    super(props);
    this.state = {
      emailSignIn: '',
      passwordSignIn: '',
      emailRegister: '',
      passwordRegister: '',
    };

    this.signInWithEmailAndPassword = this.signInWithEmailAndPassword.bind(this);
    this.registerUserWithEmailAndPassword = this.registerUserWithEmailAndPassword.bind(this);
    this.storeUserTokenAndGoNext = this.storeUserTokenAndGoNext.bind(this);
  }

  storeUserTokenAndGoNext(user) {
    user.getToken()
      .then((token) => this.props.store.dispatch(this.props.setUserTokenAction(token)));
    this.goNext();
  }

  registerUserWithEmailAndPassword() {
    const email = this.state.emailRegister;
    const password = this.state.passwordRegister;
    this.props.registerWithEmail(email, password)
      .then(this.storeUserTokenAndGoNext)
      .catch(console.log);
  }

  signInWithEmailAndPassword() {
    const email = this.state.emailSignIn;
    const password = this.state.passwordSignIn;
    this.props.signInWithEmail(email, password)
      .then(this.storeUserTokenAndGoNext)
      .catch((e) => console.log(e.code));
  }

  getInnerView(registerOrSignInType, registerOrSignInMethod) {
    const SubmitButton = MKButton
      .coloredFlatButton()
      .withText(registerOrSignInType)
      .withOnPress(() => {
        console.log(`Clicked ${registerOrSignInType}`);
        console.log(this.props.store.getState());
        console.log(this.state);
        registerOrSignInMethod();
      })
      .build();

    const scrollRef = `scroll${registerOrSignInType}`;

    const scrollToBottom = () => {
      this[scrollRef].scrollTo({ x: 0, y: 150, animated: true });
    };

    return (
      <ScrollView
        ref={(r) => this[scrollRef] = r}
        style={styles.fullScreenContainer}
        tabLabel={registerOrSignInType}
      >
        <View style={styles.padded}>
          <FacebookButton >
            <Text style={{ color: colors.white }} >
              <Icon name="facebook" size={16} />  {`${registerOrSignInType} with Facebook`}
            </Text>
          </FacebookButton>
          <View style={styles.halfPadded} />
          <GoogleButton>
            <Text style={{ color: 'grey' }}>
              <Icon name="google" size={16} />  {`${registerOrSignInType} with Google`}
            </Text>
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
            {`${registerOrSignInType} with email and password.`}
          </Text>
          <EmailInput
            onChangeText={(newText) => {
              const stateAdditions = {};
              stateAdditions[`email${registerOrSignInType.replace(/ /g, '')}`] = newText;
              this.setState(stateAdditions);
            }}
            onFocus={scrollToBottom}
          />
          <PasswordInput
            onChangeText={(newText) => {
              const stateAdditions = {};
              stateAdditions[`password${registerOrSignInType.replace(/ /g, '')}`] = newText;
              this.setState(stateAdditions);
            }}
          />
          <View style={styles.padded} />
          <SubmitButton />
        </View>
      </ScrollView>
    );
  }

  renderWithNavBar() {
    return (
      <ScrollableTabView
        tabBarBackgroundColor={colors.primary}
        tabBarUnderlineColor={colors.secondary}
        tabBarActiveTextColor={colors.secondary}
        style={styles.fullScreenContainer}
      >
        {this.getInnerView('Sign In', this.signInWithEmailAndPassword)}
        {this.getInnerView('Register', this.registerUserWithEmailAndPassword)}
      </ScrollableTabView>
    );
  }
}


