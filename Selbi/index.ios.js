import React from 'react';
import { AppRegistry } from 'react-native';

import { SimpleCamera, SimpleImageView } from './components/SimpleCamera';
import ListingsView from './components/ListingsView';
import Menu from './components/Menu';
import RightExpandingNavWithMenuDrawer from './components/RightExpandingNavWithMenuDrawer';

const localListingRoutes = [
  { title: 'Listings Near You',
    nextLabel: 'Sell',
    renderContent: () => <ListingsView />,
    index: 0 },
  { title: 'Create Listing (1/3)',
    nextLabel: '',
    renderContent: (openNext) => <SimpleCamera openNext={openNext}/>,
    index: 1 },
  { title: 'Create Listing (2/3)',
    renderContent: () => <SimpleImageView />,
    index: 2 },
];

function Application() {
  return <RightExpandingNavWithMenuDrawer routes={localListingRoutes} menu={<Menu />} />;
}


AppRegistry.registerComponent('Selbi', () => Application);
