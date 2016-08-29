import React from 'react';
import {ScrollView, View, Text, Alert} from 'react-native';
import {mdl, MKButton, setTheme} from 'react-native-material-kit';
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

const FirstNameInput = mdl.Textfield.textfieldWithFloatingLabel()
  .withPlaceholder('First Name')
  .withHighlightColor(colors.white)
  .withStyle({
    height: 48,  // have to do it on iOS
    marginTop: 10,
  })
  .build();

const LastNameInput = mdl.Textfield.textfieldWithFloatingLabel()
  .withPlaceholder('Last Name')
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
  .withOnPress(() => Alert.alert('Sorry, not yet supported.'))
  .build();

const FacebookButton = MKButton.button()
  .withStyle({
    borderRadius: 5,
  })
  .withBackgroundColor('#3b5998')
  .withOnPress(() => Alert.alert('Sorry, not yet supported.'))
  .build();

// Visible for tests.
export const TabTypes = {
  signIn: {
    asTitle: 'Sign In',
    asSentence: 'Sign in',
    stateAndRefPostfix: 'SignIn',
  },
  register: {
    asTitle: 'Register',
    asSentence: 'Register',
    stateAndRefPostfix: 'Register',
  },
};

function scrollViewRef(tabType) {
  return `scroll${tabType.stateAndRefPostfix}`;
}

function passwordState(tabType) {
  return `password${tabType.stateAndRefPostfix}`;
}

function emailState(tabType) {
  return `email${tabType.stateAndRefPostfix}`;
}

export default class SignInOrRegisterScene extends RoutableScene {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
    };

    Object.keys(TabTypes).forEach((typeKey) => {
      this.state[emailState(TabTypes[typeKey])] = '';
      this.state[passwordState(TabTypes[typeKey])] = '';
    });

    this.signInWithEmailAndPassword = this.signInWithEmailAndPassword.bind(this);
    this.registerUserWithEmailAndPassword = this.registerUserWithEmailAndPassword.bind(this);
  }

  registerUserWithEmailAndPassword() {
    const email = this.state.emailRegister;
    const password = this.state.passwordRegister;

    this.props.registerWithEmail(email, password)
      .then((user) => {
        this.props.createUser(user.uid);
        this.goNext();
      })
      .catch((error) => Alert.alert(error.message));
  }

  signInWithEmailAndPassword() {
    const email = this.state.emailSignIn;
    const password = this.state.passwordSignIn;

    this.props.signInWithEmail(email, password)
      .then(() => this.goNext())
      .catch((error) => Alert.alert(error.message));
  }

  getInnerView(registerOrSignInType, registerOrSignInMethod) {
    const SubmitButton = MKButton
      .coloredFlatButton()
      .withText(registerOrSignInType.asTitle)
      .withOnPress(() => {
        registerOrSignInMethod();
      })
      .build();

    const scrollToBottom = () => {
      this[scrollViewRef(registerOrSignInType)].scrollTo({x: 0, y: 150, animated: true});
    };

    const firstNameInputIfNecessary = registerOrSignInType === TabTypes.register ?
      <FirstNameInput /> : <View />;
    const lastNameInputIfNecessary = registerOrSignInType === TabTypes.register ?
      <LastNameInput /> : <View />;

    return (
      <ScrollView
        ref={(r) => this[scrollViewRef(registerOrSignInType)] = r}
        style={styles.paddedFullScreenContainer}
        tabLabel={registerOrSignInType.asTitle}
      >
        <FacebookButton >
          <Text style={{color: colors.white}}>
            <Icon name="facebook" size={16} /> {`${registerOrSignInType.asSentence} with Facebook`}
          </Text>
        </FacebookButton>
        <View style={styles.halfPadded} />
        <GoogleButton>
          <Text style={{ color: 'grey' }}>
            <Icon name="google" size={16} /> {`${registerOrSignInType.asSentence} with Google`}
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
          {`${registerOrSignInType.asSentence} with email and password.`}
        </Text>
        {firstNameInputIfNecessary}
        {lastNameInputIfNecessary}
        <EmailInput
          onChangeText={(newText) => {
            const stateAdditions = {};
            stateAdditions[emailState(registerOrSignInType)] = newText;
            this.setState(stateAdditions);
          }}
          onFocus={scrollToBottom}
        />
        <PasswordInput
          onChangeText={(newText) => {
            const stateAdditions = {};
            stateAdditions[passwordState(registerOrSignInType)] = newText;
            this.setState(stateAdditions);
          }}
        />
        <View style={styles.padded}/>
        <SubmitButton />
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
        {this.getInnerView(TabTypes.signIn, this.signInWithEmailAndPassword)}
        {this.getInnerView(TabTypes.register, this.registerUserWithEmailAndPassword)}
      </ScrollableTabView>
    );
  }
}

