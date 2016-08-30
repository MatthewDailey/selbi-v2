import React from 'react';
import { View, Text, TouchableHighlight, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../../styles';
import colors from '../../colors';

function notImplemented() {
  Alert.alert('Not yet supported.');
}

export default function Menu({navigator, signOut, getUser, closeMenu,
  localListingScene,
  signInOrRegisterScene}) {
  const setSceneAndCloseMenu = (scene) => {
    navigator.resetTo(localListingScene);
    closeMenu();
  };

  const signInOrRegister = () => {
    navigator.push(signInOrRegisterScene);
    closeMenu();
  };

  const getSignedInHeader = () =>
    <View style={styles.paddedCenterContainerWhite}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{getUser().displayName}</Text>
      <View style={styles.halfPadded} />
      <TouchableHighlight onPress={signOut}>
        <Text style={{ fontSize: 10 }}>Sign out</Text>
      </TouchableHighlight>
    </View>;

  const getSignedOutHeader = () =>
    <TouchableHighlight onPress={signInOrRegister}>
      <View style={styles.paddedCenterContainerWhite}>

        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Not signed in.</Text>
        <View style={styles.halfPadded} />
        <Text style={{ fontSize: 14 }}>Sign in or register.</Text>
      </View>
    </TouchableHighlight>

  const getHeader = () => {
    if (getUser()) {
      return getSignedInHeader();
    }
    console.log(getUser())
    return getSignedOutHeader();
  };

  return (
    <View style={styles.padded}>
      {getHeader()}

      <View
        style={{
          margin: 8,
          borderBottomWidth: 1,
          borderBottomColor: `${colors.dark}64`,
        }}
      />

      <TouchableHighlight
        onPress={() => setSceneAndCloseMenu(localListingScene)}
        underlayColor={colors.secondary}
      >
        <Text style={styles.menuText}><Icon name="map-marker" size={20} />  Local Listings</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
        <Text style={styles.menuText}><Icon name="users" size={20} /> Friend's Listings</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
        <Text style={styles.menuText}><Icon name="heart-o" size={20} /> Favorites</Text>
      </TouchableHighlight>

      <View
        style={{
          margin: 8,
          borderBottomWidth: 1,
          borderBottomColor: `${colors.dark}64`,
        }}
      />

      <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
        <Text style={styles.menuText}><Icon name="gift" size={20} /> My Listings</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
        <Text style={styles.menuText}><Icon name="commenting-o" size={20} /> Chats</Text>
      </TouchableHighlight>

      <View
        style={{
          margin: 8,
          borderBottomWidth: 1,
          borderBottomColor: `${colors.dark}64`,
        }}
      />

      <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
        <Text style={styles.menuText}><Icon name="user" size={20} /> My Profile</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
        <Text style={styles.menuText}><Icon name="gear" size={20} /> Settings</Text>
      </TouchableHighlight>
    </View>
  );
}
