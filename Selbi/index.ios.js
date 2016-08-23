import React from 'react';
import { AppRegistry } from 'react-native';

import { SimpleCamera, SimpleImageView } from './components/SimpleCamera';
import ListingsView from './components/ListingsView';
import { EnterTitleView, EnterPriceView, AcknowledgePostView }
  from './components/ListingFinalization';
import Menu from './components/Menu';
import RightExpandingNavWithMenuDrawer from './components/RightExpandingNavWithMenuDrawer';

import LoginOrRegisterScene from './src/scenes/LoginOrRegisterScene';

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
    title: 'Login',
    nextLabel: 'Submit',
    renderContent: () => <LoginOrRegisterScene />,
    index: 0,
  },
];

function Application() {
  return <RightExpandingNavWithMenuDrawer routes={testRoutes} menu={<Menu />} />;
}

AppRegistry.registerComponent('Selbi', () => Application);
