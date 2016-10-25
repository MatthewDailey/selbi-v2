import React from 'react';
import { ScrollView, View, Text, Alert, TextInput } from 'react-native';

import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import styles, { paddingSize } from '../../styles';
import colors from '../../colors';
import RoutableScene from '../nav/RoutableScene';
import SpinnerOverlay from '../components/SpinnerOverlay';
import { privacyPolicyScene, termsAndConditionsScene } from './legal';

import { signInWithFacebook } from '../firebase/FirebaseConnector';

import { reportSignIn } from '../SelbiAnalytics';

const inputStyle = {
  height: 48,  // have to do it on iOS
  marginTop: 10,
  fontSize: 30,
};

const FacebookButton = MKButton.button()
  .withStyle({
    borderRadius: 5,
    padding: paddingSize,
  })
  .withBackgroundColor('#3b5998')
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
    this.registerOrSignInErrorHandler = this.registerOrSignInErrorHandler.bind(this);
    this.registerOrSignInSuccessHandler = this.registerOrSignInSuccessHandler.bind(this);
  }

  registerOrSignInErrorHandler(error) {
    console.log(error);
    this.setState({ signingIn: false });

    if (!!error && !!error.message) {
      Alert.alert(error.message);
    } else {
      Alert.alert(`There was an error during ${this.props.signInOrRegisterType.asTitle}.`);
    }
  }

  registerUserWithEmailAndPassword() {
    const email = this.state.emailRegister;
    const password = this.state.passwordRegister;
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;

    if (!firstName || !lastName) {
      Alert.alert('First and last name must be filled out.');
      return Promise.resolve();
    }

    this.setState({ signingIn: true });

    // TODO we should not need to sign in after registering. This is a hacky way to work
    // around the fact that updating user name can't be done until after the user is created
    // but user updates don't trigger onAuthStateChanged events.
    return this.props.registerWithEmail(email, password)
      .then(() => this.props.createUser(`${firstName} ${lastName}`, email))
      .then(() => this.props.signInWithEmail(email, password))
      .then((user) => {
        if (user) {
          reportSignIn('email', user.uid);
        }
        return Promise.resolve(user);
      })
      .then(this.registerOrSignInSuccessHandler)
      .catch(this.registerOrSignInErrorHandler);
  }

  registerOrSignInSuccessHandler(user) {
    if (this.props.onSignedIn) {
      this.props.onSignedIn(user);
    }

    if (this.props.goHomeOnComplete) {
      this.goHome();
    } else if (this.props.goBackOnComplete) {
      this.goBack();
    } else {
      this.goNext();
    }
  }

  signInWithEmailAndPassword() {
    const email = this.state.emailSignIn;
    const password = this.state.passwordSignIn;

    this.setState({ signingIn: true });

    return this.props.signInWithEmail(email, password)
      .then((user) => {
        reportSignIn('email', user.uid);
        return Promise.resolve(user);
      })
      .then(this.registerOrSignInSuccessHandler)
      .catch(this.registerOrSignInErrorHandler);
  }

  getInnerView(registerOrSignInType, registerOrSignInMethod) {
    const SubmitButton = MKButton
      .button()
      .withStyle({
        borderRadius: 5,
        padding: paddingSize,
      })
      .withBackgroundColor(colors.secondary)
      .withText(registerOrSignInType.asTitle)
      .withOnPress(() => {
        registerOrSignInMethod();
      })
      .build();

    const scrollToFirstName = () => {
      this[scrollViewRef(registerOrSignInType)].scrollTo({x: 0, y: 150, animated: true});
    };

    const scrollToLastName = () => {
      this[scrollViewRef(registerOrSignInType)].scrollTo({x: 0, y: 240, animated: true});
    };

    const scrollToEmail = () => {
      if (registerOrSignInType === TabTypes.register) {
        this[scrollViewRef(registerOrSignInType)].scrollTo({x: 0, y: 300, animated: true});
      } else {
        this[scrollViewRef(registerOrSignInType)].scrollTo({x: 0, y: 150, animated: true});
      }
    };

    const scrollToPassword = () => {
      if (registerOrSignInType === TabTypes.register) {
        this[scrollViewRef(registerOrSignInType)].scrollTo({x: 0, y: 360, animated: true});
      } else {
        this[scrollViewRef(registerOrSignInType)].scrollTo({x: 0, y: 240, animated: true});
      }
    };

    const firstNameInputIfNecessary = registerOrSignInType === TabTypes.register ?
      <TextInput
        placeholder="First name"
        style={inputStyle}
        onChangeText={(newText) => this.setState({ firstName: newText })}
        onFocus={scrollToFirstName}
        returnKeyType="next"
        onSubmitEditing={() => this.refs.LastNameInput.focus()}
      /> : <View />;
    const lastNameInputIfNecessary = registerOrSignInType === TabTypes.register ?
      <TextInput
        placeholder="Last name"
        style={inputStyle}
        ref="LastNameInput"
        onChangeText={(newText) => this.setState({ lastName: newText })}
        onFocus={scrollToLastName}
        returnKeyType="next"
        onSubmitEditing={() => this.refs.EmailInput.focus()}
      /> : <View />;

    const termsOfServiceViewIfNecessary = registerOrSignInType === TabTypes.register ?
      <Text>
        {'By registering you are agreeing to Selbi\'s '}
        <Text
          style={{ textDecorationLine: 'underline' }}
          onPress={() => this.props.navigator.push(termsAndConditionsScene)}
        >
          terms and conditions
        </Text>
        {' as well as '}
        <Text
          style={{ textDecorationLine: 'underline' }}
          onPress={() => this.props.navigator.push(privacyPolicyScene)}
        >
          privacy policy
        </Text>.
      </Text>
      : <View />;

    return (
      <ScrollView
        ref={(r) => this[scrollViewRef(registerOrSignInType)] = r}
        style={styles.paddedFullScreenContainer}
        tabLabel={registerOrSignInType.asTitle}
      >
        <FacebookButton
          onPress={() => {
            this.setState({ signingIn: true });
            signInWithFacebook()
              .then((user) => {
                reportSignIn('facebook', user.uid);
                return Promise.resolve(user);
              })
              // We only use one provider (facebook).
              .then((user) => this.props.createUser(
                user.providerData[0].displayName,
                user.providerData[0].email))
              .then(this.registerOrSignInSuccessHandler)
              .catch(this.registerOrSignInErrorHandler);
          }}
        >
          <Text style={{ color: colors.white }}>
            <Icon name="facebook" size={16} /> {`${registerOrSignInType.asSentence} with Facebook`}
          </Text>
        </FacebookButton>
        <View style={styles.halfPadded} />
        <View style={styles.padded} />
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: `${colors.secondary}64`,
          }}
        />
        <View style={styles.padded} />
        <Text style={styles.friendlyText}>
          {`${registerOrSignInType.asSentence} with email and password.`}
        </Text>
        {firstNameInputIfNecessary}
        {lastNameInputIfNecessary}
        <TextInput
          style={inputStyle}
          placeholder="Email"
          ref="EmailInput"
          onChangeText={(newText) => {
            const stateAdditions = {};
            stateAdditions[emailState(registerOrSignInType)] = newText;
            this.setState(stateAdditions);
          }}
          onFocus={scrollToEmail}
          returnKeyType="next"
          keyboardType="email-address"
          onSubmitEditing={() => this.refs.PasswordInput.focus()}
        />
        <TextInput
          style={inputStyle}
          ref="PasswordInput"
          placeholder="Password"
          password
          onChangeText={(newText) => {
            const stateAdditions = {};
            stateAdditions[passwordState(registerOrSignInType)] = newText;
            this.setState(stateAdditions);
          }}
          onFocus={scrollToPassword}
          returnKeyType="done"
          onSubmitEditing={registerOrSignInMethod}
        />
        <View style={styles.padded} />
        <SubmitButton />
        <View style={styles.halfPadded} />
        {termsOfServiceViewIfNecessary}
      </ScrollView>
    );
  }

  renderWithNavBar() {
    return (
      <View style={styles.container}>
        <ScrollableTabView
          tabBarBackgroundColor={colors.primary}
          tabBarUnderlineColor={colors.secondary}
          tabBarActiveTextColor={colors.secondary}
          style={styles.fullScreenContainer}
          tabBarTextStyle={styles.friendlyText}
        >
          {this.getInnerView(TabTypes.signIn, this.signInWithEmailAndPassword)}
          {this.getInnerView(TabTypes.register, this.registerUserWithEmailAndPassword)}
        </ScrollableTabView>
        <SpinnerOverlay isVisible={this.state.signingIn} />
      </View>
    );
  }
}
