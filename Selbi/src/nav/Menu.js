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

    const getSignedInFooter = () =>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}
      >
        <TouchableHighlight onPress={() => {
          this.props.signOut();
          setSceneAndCloseMenu(this.props.localListingScene);
        }} underlayColor={colors.secondary}>
          <Text style={styles.menuText}><Icon name="sign-out" size={20} /> Sign out</Text>
        </TouchableHighlight>
      </View>

    const getSignedOutFooter = () =>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}
      >
        <TouchableHighlight onPress={() => {
          signInOrRegister();
        }} underlayColor={colors.secondary}>
          <Text style={styles.menuText}><Icon name="sign-in" size={20} /> Sign in</Text>
        </TouchableHighlight>
      </View>

    const getFooter = () => {
      if (this.props.userDisplayName) {
        return getSignedInFooter();
      }
      return getSignedOutFooter();
    };
    // const signInMenuStyle = this.props.userDisplayName ? {} :
    //   { textDecorationLine: 'line-through' };

    const signInMenuStyle = this.props.userDisplayName ? styles.menuText : styles.greyedOutMenuText;

    return (
      <View style={styles.paddedContainerClear}>
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
          <Text style={signInMenuStyle}><Icon name="users" size={20}/> Friends' Listings</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={ifSignedIn(notImplemented)} underlayColor={colors.secondary}>
          <Text style={signInMenuStyle}><Icon name="star-o" size={20} /> Saved Listings</Text>
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
          <Text style={signInMenuStyle}><Icon name="gift" size={20}/> My Listings</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => ifSignedIn(setSceneAndCloseMenu)(this.props.chatListScene)}
          underlayColor={colors.secondary}
        >
          <Text style={signInMenuStyle}><Icon name="commenting-o" size={20}/> Chats</Text>
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
          <Text style={signInMenuStyle}><Icon name="user-plus" size={20} /> Follow a Friend</Text>
        </TouchableHighlight>

        <View
          style={{
            margin: 8,
            borderBottomWidth: 1,
            borderBottomColor: `${colors.dark}64`,
          }}
        />

        <TouchableHighlight onPress={ifSignedIn(notImplemented)} underlayColor={colors.secondary}>
          <Text style={signInMenuStyle}><Icon name="bell-o" size={20} /> Notifications</Text>
        </TouchableHighlight>

        <View
          style={{
            margin: 8,
            borderBottomWidth: 1,
            borderBottomColor: `${colors.dark}64`,
          }}
        />

        <TouchableHighlight onPress={ifSignedIn(notImplemented)} underlayColor={colors.secondary}>
          <Text style={signInMenuStyle}><Icon name="user" size={20} /> My Profile</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={ifSignedIn(notImplemented)} underlayColor={colors.secondary}>
          <Text style={signInMenuStyle}><Icon name="gear" size={20} /> Settings</Text>
        </TouchableHighlight>

        {getFooter()}
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
