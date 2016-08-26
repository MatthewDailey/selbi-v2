import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { mdl, MKButton, setTheme } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import firebase from 'firebase';

import styles from '../../styles';
import colors from '../../colors';
import RoutableScene from '../nav/RoutableScene';

setTheme({
  primaryColor: colors.primaryColor,
});

const developConfig = {
  apiKey: 'AIzaSyCmaprrhrf42pFO3HAhmukTUby_mL8JXAk',
  authDomain: 'selbi-develop.firebaseapp.com',
  databaseURL: 'https://selbi-develop.firebaseio.com',
  storageBucket: 'selbi-develop.appspot.com',
};

let firebaseApp = null;

function getFirebase() {
  if (!firebaseApp) {
    firebaseApp = firebase.initializeApp(developConfig);
  }
  return firebaseApp;
}

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

const unsubscribeAuthListener = getFirebase()
  .onAuthStateChange(() => {
    console.log("Logged in!")
    unsubscribeAuthListener();
  });

export default class LoginOrRegisterScene extends RoutableScene {

  registerUserWithEmailAndPassword() {
    console.log('called register user')
    const email = this.state.email;
    const password = this.state.password;
    console.log(`registering: ${email} & ${password}`)



    getFirebase()
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('returned from registering user');
        getFirebase().auth().currentUser.getToken().then(console.log)
      })
      .catch(console.log);
  }

  renderWithNavBar() {
    console.log(this.props.store.getState());

    const getInnerView = (isRegister, scrollViewRef) => {
      const registerOrSignIn = isRegister ? 'Register' : 'Sign in';
      const SubmitButton = MKButton.coloredFlatButton()
        .withText(registerOrSignIn)
        .withOnPress(() => {
          console.log(`Clicked ${registerOrSignIn}`);
          this.registerUserWithEmailAndPassword();
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
        this[scrollViewRef].scrollTo({ x: 0, y: 150, animated: true });
      };

      return (
        <View style={styles.padded}>
          <FacebookButton >
            <Text style={{ color: colors.white }} >
              <Icon name="facebook" size={16} />  {`${registerOrSignIn} with Facebook`}
            </Text>
          </FacebookButton>
          <View style={styles.halfPadded} />
          <GoogleButton>
            <Text style={{ color: 'grey' }}>
              <Icon name="google" size={16} />  {`${registerOrSignIn} with Google`}
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
            {`${registerOrSignIn} with email and password.`}
          </Text>
          <EmailInput onChangeText={(newText) => this.setState({email: newText})} onFocus={scrollToBottom} />
          <PasswordInput onChangeText={(newText) => this.setState({password: newText})} />
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
        <ScrollView
          ref={ (r) => this.signInScrollView = r }
          style={styles.fullScreenContainer}
          tabLabel="Sign In"
        >
          {getInnerView(false, 'signInScrollView')}
        </ScrollView>
        <ScrollView
          ref={ (r) => this.registerScrollView = r }
          style={styles.fullScreenContainer}
          tabLabel="Register"
        >
          {getInnerView(true, 'registerScrollView')}
        </ScrollView>
      </ScrollableTabView>
    );
  }
}


