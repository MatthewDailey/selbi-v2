import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableHighlight, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../../styles';
import colors from '../../colors';
import flattenStyle from 'flattenStyle';

function notImplemented() {
  Alert.alert('Not yet supported.');
}

function Divider() {
  return (
    <View
      style={{
        margin: 8,
        borderBottomWidth: 1,
        borderBottomColor: `${colors.dark}64`,
      }}
    />
  );
}
const iconSize = flattenStyle(styles.menuText).fontSize;
const iconStyle = {
  ...flattenStyle(styles.menuText),
  textAlign: 'center',
  width: 40,
};
const menuHeaderStyle = { fontWeight: 'bold', fontSize: 16 };
const menuSubheaderStyle = { fontWeight: 'normal', fontSize: 14 };

function MenuItem({ onPress, icon, title }) {
  return (
    <TouchableHighlight onPress={onPress} underlayColor={colors.secondary}>
      <View style={styles.row}>
        <Text style={iconStyle}>{icon}</Text>
        <Text style={styles.menuText}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
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
        <Text style={menuHeaderStyle}>{this.props.userDisplayName}</Text>
        <Text style={menuSubheaderStyle}>{`@${this.props.username}`}</Text>
      </View>;

    const getSignedOutHeader = () =>
      <TouchableHighlight onPress={signInOrRegister} underlayColor={colors.secondary}>
        <View style={styles.paddedCenterContainerWhite}>
          <Text style={menuHeaderStyle}>Not signed in.</Text>
          <View style={styles.halfPadded} />
          <Text style={menuSubheaderStyle}>Sign in or register.</Text>
        </View>
      </TouchableHighlight>

    const getHeader = () => {
      if (this.props.userDisplayName) {
        return getSignedInHeader();
      }
      return getSignedOutHeader();
    };

    const getSignedInFooter = () =>
      <View style={{ flex: 1, justifyContent: 'flex-end' }} >
        <MenuItem
          onPress={() => {
            this.props.signOut();
            setSceneAndCloseMenu(this.props.localListingScene);
          }}
          icon={<Icon name="sign-out" size={iconSize} />}
          title="Sign out"
        />
      </View>;

    const getSignedOutFooter = () =>
      <View style={{ flex: 1, justifyContent: 'flex-end' }} >
        <MenuItem
          onPress={() => signInOrRegister()}
          icon={<Icon name="sign-in" size={iconSize} />}
          title="Sign in"
        />
      </View>;

    const getFooter = () => {
      if (this.props.userDisplayName) {
        return getSignedInFooter();
      }
      return getSignedOutFooter();
    };

    const signInMenuStyle = this.props.userDisplayName ? styles.menuText : styles.greyedOutMenuText;

    return (
      <View style={styles.paddedContainerClear}>
        {getHeader()}

        <Divider />

        <MenuItem
          onPress={() => setSceneAndCloseMenu(this.props.localListingScene)}
          icon={<Icon name="map-marker" size={iconSize} />}
          title="Local Listings"
        />
        <MenuItem
          onPress={() => ifSignedIn(setSceneAndCloseMenu)(this.props.friendsListingScene)}
          icon={<Icon name="users" size={iconSize} />}
          title="Friends' Listings"
        />

        <Divider />

        <MenuItem
          onPress={() => ifSignedIn(setSceneAndCloseMenu)(this.props.myListingScene)}
          icon={<Icon name="gift" size={iconSize} />}
          title="My Listings"
        />
        <MenuItem
          onPress={() => ifSignedIn(setSceneAndCloseMenu)(this.props.chatListScene)}
          icon={<Icon name="commenting-o" size={iconSize} />}
          title="Chats"
        />

        <Divider />

        <MenuItem
          onPress={() => ifSignedIn(pushSceneAndCloseMenu)(this.props.followFriendScene)}
          icon={<Icon name="user-plus" size={iconSize} />}
          title="Follow a Friend"
        />

        <Divider />

        <MenuItem
          onPress={ifSignedIn(notImplemented)}
          icon={<Icon name="bell-o" size={iconSize} />}
          title="Notifications"
        />

        <Divider />

        <MenuItem
          onPress={ifSignedIn(notImplemented)}
          icon={<Icon name="gear" size={iconSize} />}
          title="Settings"
        />

        {getFooter()}
      </View>
    );
  }
}

Menu.propTypes = {
  userDisplayName: React.PropTypes.string,
  username: React.PropTypes.string,
  closeMenu: React.PropTypes.func.isRequired,
  signOut: React.PropTypes.func.isRequired,
  navigator: React.PropTypes.object.isRequired,
  localListingScene: React.PropTypes.object.isRequired,
  friendsListingScene: React.PropTypes.object.isRequired,
  myListingScene: React.PropTypes.object.isRequired,
  chatListScene: React.PropTypes.object.isRequired,
  followFriendScene: React.PropTypes.object.isRequired,
  signInOrRegisterScene: React.PropTypes.object.isRequired,
}

export default connect(
  (state) => {
    return { userDisplayName: state.user.displayName, username: state.user.username };
  },
  undefined
)(Menu);
