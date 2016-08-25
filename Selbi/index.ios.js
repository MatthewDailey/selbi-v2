import React from 'react';
import { AppRegistry } from 'react-native';
import { createStore } from 'redux';

import Menu from './components/Menu';

import ListingScene from './src/scenes/ListingsScene';
import { SimpleCamera, SimpleImageView } from './src/scenes/CameraScene';
import DrawerNavigator from './src/nav/DrawerNavigator';

import newListingReducer from './src/reducers/NewListingReducer';

const newListingStore = createStore(newListingReducer);

const listingScene = {
  id: 'a',
  renderContent: (navigator, routeLinks, openMenu) =>
    <ListingScene navigator={navigator} routeLinks={routeLinks} openMenu={openMenu}
      title="Listings"
      leftIs="menu"
      rightIs="next"
    />,
}

const cameraScene = {
  id: 'b',
  renderContent: (navigator, routeLinks, openMenu) =>
    <SimpleCamera navigator={navigator} routeLinks={routeLinks} openMenu={openMenu}
      store={newListingStore}
      title="Take a photo"
      leftIs="back"
      rightIs="next"
    />,
}

const imageScene = {
  id: 'c',
  renderContent: (navigator, routeLinks, openMenu) =>
    <SimpleImageView navigator={navigator} routeLinks={routeLinks} openMenu={openMenu}
      store={newListingStore}
      title="Approve photo"
      leftIs="back"
      rightIs="next"
    />,
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
