import React from 'react';
import { AppRegistry } from 'react-native';

import SimpleCamera from './components/SimpleCamera';
import ListingsView from './components/ListingsView';
import Menu from './components/Menu';
import RightExpandingNavWithMenuDrawer from './components/RightExpandingNavWithMenuDrawer';

const localListingRoutes = [
  { title: 'Listings Near You',
    nextLabel: 'Sell',
    renderContent: () => <ListingsView />,
    index: 0 },
  { title: 'Create Listing',
    renderContent: () => <SimpleCamera />,
    index: 1 },
];

function Application() {
  return <RightExpandingNavWithMenuDrawer routes={localListingRoutes} menu={<Menu />} />;
}


AppRegistry.registerComponent('Selbi', () => Application);
