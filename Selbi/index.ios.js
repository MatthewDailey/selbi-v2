import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { setTheme } from 'react-native-material-kit';
import Analytics from 'react-native-firebase-analytics';
import codePush from 'react-native-code-push';

import SignInOrRegisterScene from './src/scenes/SignInOrRegisterScene';

import Menu from './src/nav/Menu';
import DrawerNavigator from './src/nav/DrawerNavigator';
import { withNavigatorProps } from './src/nav/RoutableScene';

import NewListingFlow from './src/scenes/newListingFlow';
import ListingPurchaseFlow from './src/scenes/listingPurchaseFlow';
import ChatFlow from './src/scenes/chatFlow';

import LocalListingScene from './src/scenes/rootScenes/LocalListingsScene';
import ChatListScene from './src/scenes/rootScenes/ChatListScene';
import MyListingsScene from './src/scenes/rootScenes/MyListingsScene';
import FriendsListingsScene from './src/scenes/rootScenes/FriendsListingsScene';

import FollowFriendScene from './src/scenes/FollowFriendScene';

import newListingReducer from './src/reducers/NewListingReducer';
import localListingsReducer from './src/reducers/LocalListingsReducer';
import myListingsReducer, { setMyListingsInactive, setMyListingsPrivate, setMyListingsPublic,
  setMyListingsSold, clearMyListings } from './src/reducers/MyListingsReducer';
import imagesReducer from './src/reducers/ImagesReducer';
import listingDetailReducer from './src/reducers/ListingDetailReducer';
import followFriendReducer from './src/reducers/FollowFriendReducer';
import friendsListingsReducer from './src/reducers/FriendsListingsReducer';
import userReducer, { setUserData, clearUserData } from './src/reducers/UserReducer';

import { registerWithEmail, signInWithEmail, signOut, getUser, createUser, loadUserPublicData,
  addAuthStateChangeListener, listenToListingsByStatus }
  from './src/firebase/FirebaseConnector';

import colors from './colors';
import config from './config';

// Necessary for code-push to not error out.
const RCTLog = require('RCTLog');

// Used to set camera shutter button color.
setTheme({
  accentColor: colors.accent,
  primaryColor: colors.primary,
});

const store = createStore(combineReducers({
  newListing: newListingReducer,
  localListings: localListingsReducer,
  myListings: myListingsReducer,
  images: imagesReducer,
  listingDetails: listingDetailReducer,
  followFriend: followFriendReducer,
  friendsListings: friendsListingsReducer,
  user: userReducer,
}));

// Listen for user listings and make sure to remove listener when
const listenForUserListings = (user) => {
  if (user) {
    listenToListingsByStatus('inactive',
      (listings) => store.dispatch(setMyListingsInactive(listings)));
    listenToListingsByStatus('public',
      (listings) => store.dispatch(setMyListingsPublic(listings)));
    listenToListingsByStatus('private',
      (listings) => store.dispatch(setMyListingsPrivate(listings)));
    listenToListingsByStatus('sold',
      (listings) => store.dispatch(setMyListingsSold(listings)));
  } else {
    store.dispatch(clearMyListings());
  }
};
addAuthStateChangeListener(listenForUserListings);

const recordUserForAnalytics = (user) => {
  if (user) {
    Analytics.setUserId(user.uid);
  } else {
    Analytics.setUserId(null);
  }
};
addAuthStateChangeListener(recordUserForAnalytics)

const storeUserData = (user) => {
  if (user) {
    loadUserPublicData(user.uid)
      .then((publicDataSnapshot) => {
        if (publicDataSnapshot.exists()) {
          const userPublicData = publicDataSnapshot.val();
          store.dispatch(setUserData({
            displayName: userPublicData.displayName,
            username: userPublicData.username,
          }));
        }
      });
  } else {
    store.dispatch(clearUserData());
  }
};
addAuthStateChangeListener(storeUserData)

const localListingScene = {
  id: 'listings-scene',
  renderContent: withNavigatorProps(
    <LocalListingScene
      title="Near Me"
      leftIs="menu"
      rightIs="next"
    />),
};

const myListingsScene = {
  id: 'my-listings-scene',
  renderContent: withNavigatorProps(
    <MyListingsScene
      title="My Listings"
      leftIs="menu"
    />
  ),
};

const chatListScene = {
  id: 'chat-list-scene',
  renderContent: withNavigatorProps(
    <ChatListScene
      title="Chats"
      leftIs="menu"
    />
  ),
};

const friendsListingScene = {
  id: 'friends-listings',
  renderContent: withNavigatorProps(
    <FriendsListingsScene
      title="Friend's Listings"
      leftIs="menu"
      rightIs="next"
    />
  ),
};

const followFriendScene = {
  id: 'follow-friend',
  renderContent: withNavigatorProps(
    <FollowFriendScene
      title=""
      leftIs="back"
      rightIs="return"
    />
  ),
};

let routeLinks = {};

// Link local listings to sell flow.
routeLinks[localListingScene.id] = {
  next: {
    title: 'Sell',
    getRoute: () => NewListingFlow.firstScene,
  },
  details: {
    getRoute: () => ListingPurchaseFlow.firstScene,
  },
};

routeLinks[friendsListingScene.id] = {
  next: {
    title: 'Sell',
    getRoute: () => NewListingFlow.firstScene,
  },
  details: {
    getRoute: () => ListingPurchaseFlow.firstScene,
  },
};

routeLinks[myListingsScene.id] = {
  details: {
    getRoute: () => ListingPurchaseFlow.firstScene,
  },
};

routeLinks[chatListScene.id] = {
  chat: {
    getRoute: () => ChatFlow.firstScene, // Must be logged in to see chat list scene.
  },
};

routeLinks[followFriendScene.id] = {
  return: {
    title: 'Add Friend',
  },
};

routeLinks = Object.assign(routeLinks, NewListingFlow.routesLinks);
routeLinks = Object.assign(routeLinks, ListingPurchaseFlow.routesLinks);
routeLinks = Object.assign(routeLinks, ChatFlow.routeLinks);

function renderMenu(navigator, closeMenu) {
  return (
    <Menu
      navigator={navigator}
      signOut={signOut}
      getUser={getUser}
      closeMenu={closeMenu}
      localListingScene={localListingScene}
      friendsListingScene={friendsListingScene}
      myListingScene={myListingsScene}
      chatListScene={chatListScene}
      followFriendScene={followFriendScene}
      loadUserPublicData={loadUserPublicData}
      signInOrRegisterScene={{
        id: 'menu-sign-scene',
        renderContent: withNavigatorProps(
          <SignInOrRegisterScene
            title=""
            leftIs="back"
            registerWithEmail={registerWithEmail}
            signInWithEmail={signInWithEmail}
            createUser={createUser}
            goHomeOnComplete
          />),
      }}
    />
  );
}

class NavApp extends Component {
  componentDidMount() {
    this.refreshCode = setInterval(() => {
      codePush.sync({
        updateDialog: true,
        deploymentKey: config.codePushKey,
        installMode: codePush.InstallMode.IMMEDIATE,
      });
    },
      5000);
  }

  componentWillUnmount() {
    clearInterval(this.refreshCode);
  }

  render() {
    return (
      <Provider store={store}>
        <DrawerNavigator
          initialRoute={localListingScene}
          routeLinks={routeLinks}
          renderMenuWithNavigator={renderMenu}
        />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Selbi', () => NavApp);
