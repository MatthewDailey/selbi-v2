import React from 'react';
import { AppRegistry } from 'react-native';
import { createStore, combineReducers } from 'redux';

import Menu from './components/Menu';

import SignInOrRegisterScene from './src/scenes/SignInOrRegisterScene';
import ListingScene from './src/scenes/ListingsScene';
import InputScene from './src/scenes/InputScene';
import PublishScene from './src/scenes/PublishScene';
import { SimpleCamera, SimpleImageView } from './src/scenes/CameraScene';
import DrawerNavigator from './src/nav/DrawerNavigator';
import { withNavigatorProps } from './src/nav/RoutableScene';

import newListingReducer, { setNewListingPrice, setNewListingTitle }
  from './src/reducers/NewListingReducer';

import { registerWithEmail, signInWithEmail, getUser, createListing, createUser, publishImage }
  from './src/firebase/FirebaseConnector';

const store = createStore(combineReducers({
  newListing: newListingReducer,
}));
const withProps = withNavigatorProps.bind(undefined, store);

const listingScene = {
  id: 'listings-scene',
  renderContent: withProps(
    <ListingScene
      title="Listings"
      leftIs="menu"
      rightIs="next"
    />),
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

const postLoginScene = {
  id: 'post-login',
  renderContent: withProps(
    <PublishScene
      title="Success!"
      rightIs="home"
      createListing={createListing}
      publishImage={publishImage}
    />
  ),
};

const priceScene = {
  id: 'price-scene',
  renderContent: withProps(
    <InputScene
      title="Create Listing (2/3)"
      leftIs="back"
      rightIs="next"
      inputTitle="How much do you want to sell for?"
      placeholder="USD"
      isNumeric
      floatingLabel
      recordInputAction={setNewListingPrice}
      loadInitialInput={() => {
        const price = store.getState().newListing.get('price');
        if (price) {
          return price.toString();
        }
        return price;
      }}
    />
  ),
};

const titleScene = {
  id: 'title-scene',
  renderContent: withProps(
    <InputScene
      title="Create Listing (3/3)"
      leftIs="back"
      rightIs="next"
      inputTitle="What are you selling?"
      placeholder="Eg. 'Magic coffee table!'"
      recordInputAction={setNewListingTitle}
      loadInitialInput={() => store.getState().newListing.get('title')}
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
  renderContent: withProps(
    <SimpleImageView
      title=""
      leftIs="back"
      rightIs="next"
    />),
};

const routeLinks = {};

routeLinks[listingScene.id] = {
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
    getRoute: () => priceScene,
  },
};
routeLinks[priceScene.id] = {
  next: {
    title: 'OK',
    getRoute: () => titleScene,
  },
};
routeLinks[titleScene.id] = {
  next: {
    title: 'Post',
    getRoute: () => {
      if (getUser()) {
        return postLoginScene;
      }
      return loginScene;
    },
  },
};
routeLinks[loginScene.id] = {
  next: {
    title: '',
    getRoute: () => postLoginScene,
  },
};
routeLinks[postLoginScene.id] = {
  home: {
    title: 'Done',
  },
};

console.log(`Route Links::: ${routeLinks}`);

function NavApp() {
  return <DrawerNavigator initialRoute={loginScene} routeLinks={routeLinks} menu={<Menu />} />;
}

AppRegistry.registerComponent('Selbi', () => NavApp);
