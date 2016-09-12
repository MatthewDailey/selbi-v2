import React from 'react';
import { connect } from 'react-redux';
import { AppRegistry } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { setTheme } from 'react-native-material-kit';

import Menu from './src/nav/Menu';
import SignInOrRegisterScene from './src/scenes/SignInOrRegisterScene';
import LocalListingScene from './src/scenes/LocalListingsScene';

import DrawerNavigator from './src/nav/DrawerNavigator';
import { withNavigatorProps } from './src/nav/RoutableScene';
import MyListingsScene from './src/scenes/MyListingsScene';

import NewListingFlow from './src/scenes/newListingFlow';
import ChatListScene from './src/scenes/ChatListScene';

import ChatScene from './src/scenes/listingPurchaseFlow/ChatScene';
import ListingDetailScene from './src/scenes/listingPurchaseFlow/ListingDetailScene';

import newListingReducer from './src/reducers/NewListingReducer';
import localListingsReducer from './src/reducers/LocalListingsReducer';
import myListingsReducer, { setMyListingsInactive, setMyListingsPrivate, setMyListingsPublic,
  setMyListingsSold, clearMyListings } from './src/reducers/MyListingsReducer';
import imagesReducer from './src/reducers/ImagesReducer';
import listingDetailReducer, { setBuyerUid } from './src/reducers/ListingDetailReducer';

import { registerWithEmail, signInWithEmail, signOut, getUser, createUser, createChatAsBuyer,
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
  listingDetails: listingDetailReducer,
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

const chatScene = {
  id: 'chat-scene',
  renderContent: withNavigatorProps(<ChatScene leftIs="back" />),
};

const listingDetailScene = {
  id: 'listing-detail-scene',
  renderContent: withNavigatorProps(<ListingDetailScene leftIs="back" />),
};

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

const mapStateToProps = (state) => {
  return {
    onSignedIn: (buyerUid) => {
      console.log(store.listingDetails)
      store.dispatch(setBuyerUid(buyerUid));
      createChatAsBuyer(
        state.listingDetails.listingKey,
        state.listingDetails.listingData.sellerId);
    },
  };
};

const ChatSignIn = connect(
  mapStateToProps,
  undefined
)(SignInOrRegisterScene);


const chatSignInScene = {
  id: 'chat-login-scene',
  renderContent: withNavigatorProps(
    <ChatSignIn
      title="Sign in to chat."
      leftIs="back"
      rightIs="next"
      registerWithEmail={registerWithEmail}
      signInWithEmail={signInWithEmail}
      createUser={createUser}
    />),
};


let routeLinks = {};

// Link local listings to sell flow.
routeLinks[localListingScene.id] = {
  next: {
    title: 'Sell',
    getRoute: () => NewListingFlow.firstScene,
  },
  details: {
    getRoute: () => listingDetailScene,
  },
};

routeLinks[myListingsScene.id] = {
  details: {
    getRoute: () => listingDetailScene,
  },
};

routeLinks[chatListScene.id] = {
  chat: {
    getRoute: () => {
      if (getUser()) {
        return chatScene;
      }
      return chatSignInScene;
    },
  },
};

routeLinks[listingDetailScene.id] = {
  chat: {
    getRoute: () => {
      if (getUser()) {
        return chatScene;
      }
      return chatSignInScene;
    },
  },
};

routeLinks[chatSignInScene.id] = {
  next: {
    title: '',
    getRoute: () => chatScene,
  },
};

routeLinks = Object.assign(routeLinks, NewListingFlow.routesLinks);

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
