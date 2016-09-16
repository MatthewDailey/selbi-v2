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
      username: undefined,
    };

    this.updateStateFromUser = this.updateStateFromUser.bind(this);
  }

  updateStateFromUser(user) {
    if (user) {
      this.props.loadUserPublicData(user.uid)
        .then((publicDataSnapshot) => {
          const userPublicData = publicDataSnapshot.val();
          this.setState({
            userDisplayName: userPublicData.displayName,
            username: userPublicData.username,
          });
        })
        .catch(console.log);
    } else {
      this.setState({
        userDisplayName: undefined,
      });
    }
  }

  componentDidMount() {
    this.props.addAuthStateChangeListener(this.updateStateFromUser);

    this.updateStateFromUser(this.props.getUser());
  }

  componentWillUnmount() {
    this.props.removeAuthStateChangeListener(this.updateStateFromUser);
  }

  render() {
    const ifSignedIn = (sceneFunction) =>
      (scene) => {
        if (this.state.userDisplayName) {
          sceneFunction(scene);
        } else {
          Alert.alert('You must sign in first.');
        }
      };

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
        <Text style={{fontWeight: 'normal', fontSize: 13}}>{`@${this.state.username}`}</Text>
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
      if (this.state.userDisplayName) {
        return getSignedInHeader();
      }
      return getSignedOutHeader();
    };

    const signInMenuStyle = this.state.userDisplayName ? {} :
      { textDecorationLine: 'line-through' };

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
        <TouchableHighlight onPress={ifSignedIn(notImplemented)} underlayColor={colors.secondary}>
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

        <TouchableHighlight onPress={ifSignedIn(notImplemented)} underlayColor={colors.secondary}>
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
