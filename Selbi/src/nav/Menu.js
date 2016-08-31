import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../../styles';
import colors from '../../colors';

function notImplemented() {
  Alert.alert('Not yet supported.');
}

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userDisplayName: undefined,
    };

    this.props.addAuthStateChangeListener((user) => {
      if (user) {
        this.setState({
          userDisplayName: user.displayName,
        });
      } else {
        this.setState({
          userDisplayName: undefined,
        });
      }
    });
  }

  render() {
    const setSceneAndCloseMenu = (scene) => {
      this.props.navigator.resetTo(scene);
      this.props.closeMenu();
    };

    const signInOrRegister = () => {
      this.props.navigator.push(this.props.signInOrRegisterScene);
      this.props.closeMenu();
    };

    const getSignedInHeader = () =>
      <View style={styles.paddedCenterContainerWhite}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>{this.state.userDisplayName}</Text>
        <View style={styles.halfPadded}/>
        <TouchableHighlight onPress={this.props.signOut} underlayColor={colors.secondary}>
          <Text style={{fontSize: 10}}>Sign out</Text>
        </TouchableHighlight>
      </View>;

    const getSignedOutHeader = () =>
      <TouchableHighlight onPress={signInOrRegister} underlayColor={colors.secondary}>
        <View style={styles.paddedCenterContainerWhite}>
          <Text style={{fontWeight: 'bold', fontSize: 16 }}>Not signed in.</Text>
          <View style={styles.halfPadded}/>
          <Text style={{fontSize: 14}}>Sign in or register.</Text>
        </View>
      </TouchableHighlight>

    const getHeader = () => {
      if (this.state.userDisplayName) {
        return getSignedInHeader();
      }
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
          onPress={() => setSceneAndCloseMenu(this.props.localListingScene)}
          underlayColor={colors.secondary}
        >
          <Text style={styles.menuText}><Icon name="map-marker" size={20}/> Local Listings</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
          <Text style={styles.menuText}><Icon name="users" size={20}/> Friend's Listings</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
          <Text style={styles.menuText}><Icon name="heart-o" size={20}/> Favorites</Text>
        </TouchableHighlight>

        <View
          style={{
            margin: 8,
            borderBottomWidth: 1,
            borderBottomColor: `${colors.dark}64`,
          }}
        />

        <TouchableHighlight
          onPress={() => setSceneAndCloseMenu(this.props.myListingScene)}
          underlayColor={colors.secondary}>
          <Text style={styles.menuText}><Icon name="gift" size={20}/> My Listings</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
          <Text style={styles.menuText}><Icon name="commenting-o" size={20}/> Chats</Text>
        </TouchableHighlight>

        <View
          style={{
            margin: 8,
            borderBottomWidth: 1,
            borderBottomColor: `${colors.dark}64`,
          }}
        />

        <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
          <Text style={styles.menuText}><Icon name="user" size={20}/> My Profile</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
          <Text style={styles.menuText}><Icon name="gear" size={20}/> Settings</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
