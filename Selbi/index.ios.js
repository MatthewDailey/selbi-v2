import React from 'react';
import { AppRegistry } from 'react-native';
import { createStore } from 'redux';

import Menu from './components/Menu';

import ListingScene from './src/scenes/ListingsScene';
import { SimpleCamera, SimpleImageView } from './src/scenes/CameraScene';
import DrawerNavigator from './src/nav/DrawerNavigator';
import { withNavigatorProps } from './src/nav/RoutableScene';

import newListingReducer from './src/reducers/NewListingReducer';

const withProps = withNavigatorProps.bind(undefined, createStore(newListingReducer));

const listingScene = {
  id: 'a',
  renderContent: withProps(
    <ListingScene
      title="Listings"
      leftIs="menu"
      rightIs="next"
    />),
};

const cameraScene = {
  id: 'b',
  renderContent: withProps(
    <SimpleCamera
      title="Take a photo"
      leftIs="back"
      rightIs="next"
    />),
};

const imageScene = {
  id: 'c',
  renderContent: withProps(
    <SimpleImageView
      title="Approve photo"
      leftIs="back"
      rightIs="next"
    />),
};

const routeLinks = {};

routeLinks[listingScene.id] = {
  next: {
    title: 'Camera',
    getRoute: () => cameraScene,
  },
};

routeLinks[cameraScene.id] = {
  next: {
    title: '',
    getRoute: () => imageScene,
  },
}

console.log(`Route Links::: ${routeLinks}`);

function NavApp() {
  return <DrawerNavigator initialRoute={listingScene} routeLinks={routeLinks} menu={<Menu />} />;
}

AppRegistry.registerComponent('Selbi', () => NavApp);
