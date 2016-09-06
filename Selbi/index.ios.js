import React from 'react';
import { AppRegistry } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import Menu from './src/nav/Menu';
import SignInOrRegisterScene from './src/scenes/SignInOrRegisterScene';
import ListingScene from './src/scenes/ListingsScene';


import DrawerNavigator from './src/nav/DrawerNavigator';
import { withNavigatorProps } from './src/nav/RoutableScene';
import MyListingsScene from './src/scenes/MyListingsScene';

import SimpleCamera from './src/scenes/newListingFlow/CameraScene';
import ApproveImageScene from './src/scenes/newListingFlow/ApproveImageScene';
import PublishScene from './src/scenes/newListingFlow/PublishScene';
import PriceInputScene from './src/scenes/newListingFlow/PriceInputScene';
import TitleInputScene from './src/scenes/newListingFlow/TitleInputScene';

import ChatListScene from './src/scenes/ChatListScene';

import newListingReducer from './src/reducers/NewListingReducer';

import { registerWithEmail, signInWithEmail, signOut, getUser, createListing, createUser,
  publishImage, addAuthStateChangeListener, removeAuthStateChangeListener }
  from './src/firebase/FirebaseConnector';

const store = createStore(combineReducers({
  newListing: newListingReducer,
}));
const withProps = withNavigatorProps.bind(undefined, store);

const newPriceInputScene = {
  it: 'new-price-listing',
  renderContent: withNavigatorProps(undefined,
    <PriceInputScene
      title="Create Listing (2/3)"
      leftIs="back"
      rightIs="next"
      inputTitle="How much do you want to sell for?"
      placeholder="USD"
      isNumeric
      floatingLabel
    />
  ),
};

const localListingScene = {
  id: 'listings-scene',
  renderContent: withProps(
    <ListingScene
      title="Near Me"
      leftIs="menu"
      rightIs="next"
    />),
};

const myListingsScene = {
  id: 'my-listings-scene',
  renderContent: withProps(
    <MyListingsScene
      title="My Listings"
      leftIs="menu"
    />
  ),
};

const chatListScene = {
  id: 'chat-list-scene',
  renderContent: withProps(
    <ChatListScene
      title="Chats"
      leftIs="menu"
    />
  ),
};

const loginScene = {
  id: 'login-scene',
  renderContent: withProps(
    <SignInOrRegisterScene
      title="Wait! One more thing."
      leftIs="back"
      rightIs="next"
      registerWithEmail={registerWithEmail}
      signInWithEmail={signInWithEmail}
      createUser={createUser}
    />),
};

const publishScene = {
  id: 'post-login',
  renderContent: withNavigatorProps(undefined,
    <PublishScene
      title=""
      rightIs="home"
      createListing={createListing}
      publishImage={publishImage}
    />
  ),
};

const newTitleScene = {
  id: 'new-title-scene',
  renderContent: withNavigatorProps(undefined,
    <TitleInputScene
      title="Create Listing (3/3)"
      leftIs="back"
      rightIs="next"
      inputTitle="What are you selling?"
      placeholder="Eg. 'Magic coffee table!'"
    />
  ),
};

const cameraScene = {
  id: 'b',
  renderContent: withProps(
    <SimpleCamera
      title="Create Listing (1/3)"
      leftIs="back"
      rightIs="next"
    />),
};

const imageScene = {
  id: 'c',
  renderContent: withNavigatorProps(undefined,
    <ApproveImageScene
      title=""
      leftIs="back"
      rightIs="next"
    />),
};

const routeLinks = {};

routeLinks[localListingScene.id] = {
  next: {
    title: 'Sell',
    getRoute: () => cameraScene,
  },
};
routeLinks[cameraScene.id] = {
  next: {
    title: '',
    getRoute: () => imageScene,
  },
};
routeLinks[imageScene.id] = {
  next: {
    title: 'Accept Photo',
    getRoute: () => newPriceInputScene,
  },
};
routeLinks[newPriceInputScene.id] = {
  next: {
    title: 'OK',
    getRoute: () => newTitleScene,
  },
};
routeLinks[newTitleScene.id] = {
  next: {
    title: 'Post',
    getRoute: () => {
      if (getUser()) {
        return publishScene;
      }
      return loginScene;
    },
  },
};
routeLinks[loginScene.id] = {
  next: {
    title: '',
    getRoute: () => publishScene,
  },
};
routeLinks[publishScene.id] = {
  home: {
    title: 'Done',
  },
};

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
        renderContent: withProps(
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
