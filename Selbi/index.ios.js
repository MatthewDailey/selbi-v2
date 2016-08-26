import React from 'react';
import { AppRegistry } from 'react-native';
import { createStore, combineReducers } from 'redux';

import Menu from './components/Menu';

import LoginOrRegisterScene from './src/scenes/LoginOrRegisterScene';
import ListingScene from './src/scenes/ListingsScene';
import InputScene from './src/scenes/InputScene';
import { SimpleCamera, SimpleImageView } from './src/scenes/CameraScene';
import DrawerNavigator from './src/nav/DrawerNavigator';
import { withNavigatorProps } from './src/nav/RoutableScene';

import newListingReducer, { setNewListingPrice, setNewListingTitle }
from './src/reducers/NewListingReducer';

const withProps = withNavigatorProps.bind(undefined,
  createStore(combineReducers({
    newListing: newListingReducer,
  })));

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
    <LoginOrRegisterScene
      title=""
      leftIs="back"
      rightIs="next"
    />),
};

const priceScene = {
  id: 'price-scene',
  renderContent: withProps(
    <InputScene
      title="Create Listing (2/3)"
      leftIs="back"
      rightIs="next"
      inputTitle="How much do you want to sell for?"
      field="price"
      placeholder="USD"
      isNumeric
      floatingLabel
      recordInputAction={setNewListingPrice}
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
      field="title"
      placeholder="Eg. 'Magic coffee table!'"
      recordInputAction={setNewListingTitle}
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
    getRoute: () => loginScene,
  },
}

console.log(`Route Links::: ${routeLinks}`);

function NavApp() {
  return <DrawerNavigator initialRoute={listingScene} routeLinks={routeLinks} menu={<Menu />} />;
}

AppRegistry.registerComponent('Selbi', () => NavApp);
