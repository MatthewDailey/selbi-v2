import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableHighlight, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// noinspection Eslint - Dimensions provided by react-native env.
import flattenStyle from 'flattenStyle';

import styles from '../../styles';
import colors from '../../colors';

import { reportButtonPress } from '../SelbiAnalytics';

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

function MenuItem({ onPress, icon, title, shouldGreyOut }) {
  let textColor = colors.black;
  if (shouldGreyOut) {
    textColor = colors.greyedOut;
  }

  return (
    <TouchableHighlight onPress={onPress} underlayColor={colors.secondary}>
      <View style={styles.row}>
        <Text style={{ ...iconStyle, color: textColor }}>{icon}</Text>
        <Text style={{ ...flattenStyle(styles.menuText), color: textColor }}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}
MenuItem.propTypes = {
  onPress: React.PropTypes.func.isRequired,
  icon: React.PropTypes.element.isRequired,
  title: React.PropTypes.string.isRequired,
  shouldGreyOut: React.PropTypes.bool,
};

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
      reportButtonPress('menu_sign_in');
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
      </TouchableHighlight>;

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
            reportButtonPress('menu_sign_out');
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

    const isSignedOut = () => !this.props.userDisplayName;

    return (
      <View style={styles.paddedContainerClear}>
        {getHeader()}

        <Divider />

        <MenuItem
          onPress={() => {
            reportButtonPress('menu_sell_something');
            pushSceneAndCloseMenu(this.props.sellScene);
          }}
          icon={<Icon name="money" size={iconSize} />}
          title="Sell Something"
        />

        <Divider />

        <MenuItem
          onPress={() => {
            reportButtonPress('menu_local_listings');
            setSceneAndCloseMenu(this.props.localListingScene);
          }}
          icon={<Icon name="map-marker" size={iconSize} />}
          title="Local Listings"
        />
        <MenuItem
          shouldGreyOut={isSignedOut()}
          onPress={() => {
            if (!isSignedOut()) {
              reportButtonPress('menu_friends_listings');
            }
            ifSignedIn(setSceneAndCloseMenu)(this.props.friendsListingScene);
          }}
          icon={<Icon name="users" size={iconSize} />}
          title="Friends' Listings"
        />

        <Divider />

        <MenuItem
          shouldGreyOut={isSignedOut()}
          onPress={() => {
            if (!isSignedOut()) {
              reportButtonPress('menu_my_listings');
            }
            ifSignedIn(setSceneAndCloseMenu)(this.props.myListingScene);
          }}
          icon={<Icon name="gift" size={iconSize} />}
          title="My Listings"
        />
        <MenuItem
          shouldGreyOut={isSignedOut()}
          onPress={() => {
            if (!isSignedOut()) {
              reportButtonPress('menu_chats');
            }
            ifSignedIn(setSceneAndCloseMenu)(this.props.chatListScene);
          }}
          icon={<Icon name="commenting-o" size={iconSize} />}
          title="Chats"
        />

        <Divider />

        <MenuItem
          shouldGreyOut={isSignedOut()}
          onPress={() => {
            if (!isSignedOut()) {
              reportButtonPress('menu_follow_friend');
            }
            ifSignedIn(pushSceneAndCloseMenu)(this.props.followFriendScene);
          }}
          icon={<Icon name="user-plus" size={iconSize} />}
          title="Follow a Friend"
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
  sellScene: React.PropTypes.object.isRequired,
};

export default connect(
  (state) => {
    return { userDisplayName: state.user.displayName, username: state.user.username };
  },
  undefined
)(Menu);
