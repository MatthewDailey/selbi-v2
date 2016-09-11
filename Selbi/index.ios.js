import React from 'react';
import { AppRegistry } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { setTheme } from 'react-native-material-kit';

import Menu from './src/nav/Menu';
import SignInOrRegisterScene from './src/scenes/SignInOrRegisterScene';
import ListingScene from './src/scenes/LocalListingsScene';


import DrawerNavigator from './src/nav/DrawerNavigator';
import { withNavigatorProps } from './src/nav/RoutableScene';
import MyListingsScene from './src/scenes/MyListingsScene';

import { newListingFirstScene, newListingRoutesLinks } from './src/scenes/newListingFlow';

import ChatListScene from './src/scenes/ChatListScene';

import newListingReducer from './src/reducers/NewListingReducer';
import localListingsReducer from './src/reducers/LocalListingsReducer';
import myListingsReducer, { setMyListingsInactive, setMyListingsPrivate, setMyListingsPublic,
  setMyListingsSold, clearMyListings } from './src/reducers/MyListingsReducer';
import imagesReducer from './src/reducers/ImagesReducer';

import { registerWithEmail, signInWithEmail, signOut, getUser, createUser,
  addAuthStateChangeListener, removeAuthStateChangeListener, listenToListingsByStatus }
  from './src/firebase/FirebaseConnector';

import colors from './colors';

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

const localListingScene = {
  id: 'listings-scene',
  renderContent: withNavigatorProps(
    <ListingScene
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

let routeLinks = {};

// Link local listings to sell flow.
routeLinks[localListingScene.id] = {
  next: {
    title: 'Sell',
    getRoute: () => newListingFirstScene,
  },
};

routeLinks = Object.assign(routeLinks, newListingRoutesLinks);

function renderMenu(navigator, closeMenu) {
  return (
    <Menu
      navigator={navigator}
      signOut={signOut}
      getUser={getUser}
      closeMenu={closeMenu}
      localListingScene={localListingScene}
      myListingScene={myListingsScene}
      chatListScene={chatListScene}
      addAuthStateChangeListener={addAuthStateChangeListener}
      removeAuthStateChangeListener={removeAuthStateChangeListener}
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

function NavApp() {
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

AppRegistry.registerComponent('Selbi', () => NavApp);
