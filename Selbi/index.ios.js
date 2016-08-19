import React from 'react';
import { AppRegistry } from 'react-native';

import { SimpleCamera, SimpleImageView } from './components/SimpleCamera';
import ListingsView from './components/ListingsView';
import { EnterTitleView, EnterPriceView, AcknowledgePostView } from './components/ListingFinalization';
import Menu from './components/Menu';
import RightExpandingNavWithMenuDrawer from './components/RightExpandingNavWithMenuDrawer';

const localListingRoutes = [
  // { title: 'Listings Near You',
  //   nextLabel: 'Sell',
  //   renderContent: () => <ListingsView />,
  //   index: 0 },
  // { title: 'Create Listing (1/3)',
  //   nextLabel: '',
  //   renderContent: (openNext) => <SimpleCamera openNext={openNext}/>,
  //   index: 1 },
  // { title: 'Create Listing (2/3)',
  //   renderContent: () => <SimpleImageView />,
  //   index: 2 },
  { title: 'Create Listing (3/4)',
    nextLabel: 'Next',
    renderContent: () => <EnterTitleView />,
    index: 0 },
  { title: 'Create Listing (4/4)',
    nextLabel: 'Post',
    renderContent: () => <EnterPriceView />,
    index: 1 },
  { title: 'Listing Complete!',
    renderContent: () => <AcknowledgePostView />,
    index: 2 },
];

function Application() {
  return <RightExpandingNavWithMenuDrawer routes={localListingRoutes} menu={<Menu />} />;
}


AppRegistry.registerComponent('Selbi', () => Application);
