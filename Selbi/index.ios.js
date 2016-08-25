import React from 'react';
import { AppRegistry } from 'react-native';

import { createStore } from 'redux';

import { SimpleImageView } from './components/SimpleCamera';
import ListingsView from './components/ListingsView';
import { EnterTitleView, EnterPriceView, AcknowledgePostView }
  from './components/ListingFinalization';
import Menu from './components/Menu';
import RightExpandingNavWithMenuDrawer from './components/RightExpandingNavWithMenuDrawer';

import ListingScene from './src/scenes/ListingsScene';
import { SimpleCamera } from './src/scenes/CameraScene';
import DrawerNavigator from './src/nav/DrawerNavigator';

import newListingReducer from './src/reducers/NewListingReducer';

const newListingStore = createStore(newListingReducer);

const listingStore = {
  price: '',
  title: '',
  img: {},
};

const localListingRoutes = [
  { title: 'Listings Near You',
    nextLabel: 'Sell',
    renderContent: () => <ListingsView />,
    index: 0 },
  { title: 'Create Listing (1/4)',
    nextLabel: '',
    renderContent: (openNext) => <SimpleCamera openNext={openNext} listingStore={listingStore} />,
    index: 1 },
  { title: 'Create Listing (2/4)',
    nextLabel: 'Accept',
    renderContent: () => <SimpleImageView listingStore={listingStore} />,
    index: 2 },
  { title: 'Create Listing (3/4)',
    nextLabel: 'Next',
    renderContent: () => <EnterTitleView listingStore={listingStore} />,
    index: 3 },
  { title: 'Create Listing (4/4)',
    nextLabel: 'Post',
    renderContent: () => <EnterPriceView listingStore={listingStore} />,
    index: 4 },
  { title: 'Listing Complete!',
    renderContent: () => <AcknowledgePostView listingStore={listingStore} />,
    index: 5 },
];

const testRoutes = [
  {
    title: 'Log In',
    nextLabel: 'Submit',
    renderContent: () => <ListingScene />,
    index: 0,
  },
];

const listingScene = {
  id: 'a',
  renderContent: (navigator, routeLinks, openMenu) =>
    <ListingScene
      navigator={navigator}
      routeLinks={routeLinks}
      openMenu={openMenu}
      title="Listings"
      leftIs="menu"
      rightIs="next"
    />,
}

const cameraScene = {
  id: 'b',
  renderContent: (navigator, routeLinks, openMenu) =>
    <SimpleCamera
      navigator={navigator}
      routeLinks={routeLinks}
      openMenu={openMenu}
      store={newListingStore}
      title="B"
      leftIs="back"
    />,
}

const routeLinks = {};

routeLinks[listingScene.id] = {
  next: {
    title: 'Camera',
    getRoute: () => cameraScene,
  },
};


console.log("ROUTE LINKS");
console.log(routeLinks);

function NavApp() {
  return <DrawerNavigator initialRoute={listingScene} routeLinks={routeLinks} menu={<Menu />} />;
}

function Application() {
  return <RightExpandingNavWithMenuDrawer routes={testRoutes} menu={<Menu />} />;
}

AppRegistry.registerComponent('Selbi', () => NavApp);
