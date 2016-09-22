import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableHighlight, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../../styles';
import colors from '../../colors';

function notImplemented() {
  Alert.alert('Not yet supported.');
}

class Menu extends Component {
  render() {
    const ifSignedIn = (sceneFunction) =>
      (scene) => {
        if (this.props.userDisplayName) {
          sceneFunction(scene);
        } else {
          Alert.alert('You must sign in first.');
        }
      };

    const setSceneAndCloseMenu = (scene) => {
      this.props.navigator.resetTo(scene);
      this.props.closeMenu();
    };

    const pushSceneAndCloseMenu = (scene) => {
      this.props.navigator.push(scene);
      this.props.closeMenu();
    };

    const signInOrRegister = () => {
      this.props.navigator.push(this.props.signInOrRegisterScene);
      this.props.closeMenu();
    };

    const getSignedInHeader = () =>
      <View style={styles.paddedCenterContainerWhite}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>{this.props.userDisplayName}</Text>
        <Text style={{fontWeight: 'normal', fontSize: 13}}>{`@${this.props.username}`}</Text>
        <View style={styles.halfPadded}/>
        <TouchableHighlight onPress={() => {
          this.props.signOut();
          setSceneAndCloseMenu(this.props.localListingScene);
        }} underlayColor={colors.secondary}>
          <Text style={{fontSize: 10}}>Sign out</Text>
        </TouchableHighlight>
      </View>;

    const getSignedOutHeader = () =>
      <TouchableHighlight onPress={signInOrRegister} underlayColor={colors.secondary}>
        <View style={styles.paddedCenterContainerWhite}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Not signed in.</Text>
          <View style={styles.halfPadded} />
          <Text style={{ fontSize: 14 }}>Sign in or register.</Text>
        </View>
      </TouchableHighlight>

    const getHeader = () => {
      if (this.props.userDisplayName) {
        return getSignedInHeader();
      }
      return getSignedOutHeader();
    };

    // const signInMenuStyle = this.props.userDisplayName ? {} :
    //   { textDecorationLine: 'line-through' };

    const signInMenuStyle = this.props.userDisplayName ? {} :
    { color: colors.greyedOut };

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
        <TouchableHighlight
          onPress={() => ifSignedIn(setSceneAndCloseMenu)(this.props.friendsListingScene)}
          underlayColor={colors.secondary}
        >
          <Text style={styles.menuText}>
            <Icon name="users" size={20}/> <Text style={signInMenuStyle}>Friend's Listings</Text>
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={ifSignedIn(notImplemented)} underlayColor={colors.secondary}>
          <Text style={styles.menuText}>
            <Icon name="heart-o" size={20} /> <Text style={signInMenuStyle}>Favorites</Text>
          </Text>
        </TouchableHighlight>

        <View
          style={{
            margin: 8,
            borderBottomWidth: 1,
            borderBottomColor: `${colors.dark}64`,
          }}
        />

        <TouchableHighlight
          onPress={() => ifSignedIn(setSceneAndCloseMenu)(this.props.myListingScene)}
          underlayColor={colors.secondary}
        >
          <Text style={styles.menuText}>
            <Icon name="gift" size={20}/> <Text style={signInMenuStyle}>My Listings</Text>
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => ifSignedIn(setSceneAndCloseMenu)(this.props.chatListScene)}
          underlayColor={colors.secondary}
        >
          <Text style={styles.menuText}>
            <Icon name="commenting-o" size={20}/> <Text style={signInMenuStyle}>Chats</Text>
          </Text>
        </TouchableHighlight>

        <View
          style={{
            margin: 8,
            borderBottomWidth: 1,
            borderBottomColor: `${colors.dark}64`,
          }}
        />

        <TouchableHighlight
          onPress={() => ifSignedIn(pushSceneAndCloseMenu)(this.props.followFriendScene)}
          underlayColor={colors.secondary}
        >
          <Text style={styles.menuText}>
            <Icon name="user-plus" size={20}/> <Text style={signInMenuStyle}>Follow a Friend</Text>
          </Text>
        </TouchableHighlight>

        <View
          style={{
            margin: 8,
            borderBottomWidth: 1,
            borderBottomColor: `${colors.dark}64`,
          }}
        />

        <TouchableHighlight onPress={ifSignedIn(notImplemented)} underlayColor={colors.secondary}>
          <Text style={styles.menuText}>
            <Icon name="user" size={20} /> <Text style={signInMenuStyle}>My Profile</Text>
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={ifSignedIn(notImplemented)} underlayColor={colors.secondary}>
          <Text style={styles.menuText}>
            <Icon name="gear" size={20} /> <Text style={signInMenuStyle}>Settings</Text>
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export default connect(
  (state) => {
    return { userDisplayName: state.user.displayName, username: state.user.username };
  },
  undefined
)(Menu);
