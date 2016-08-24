import React from 'react';
import { AppRegistry } from 'react-native';

import { SimpleCamera, SimpleImageView } from './components/SimpleCamera';
import ListingsView from './components/ListingsView';
import { EnterTitleView, EnterPriceView, AcknowledgePostView }
  from './components/ListingFinalization';
import Menu from './components/Menu';
import RightExpandingNavWithMenuDrawer from './components/RightExpandingNavWithMenuDrawer';

import LoginOrRegisterScene from './src/scenes/LoginOrRegisterScene';
import ListingScene from './src/scenes/ListingsScene';
import NavBar from './src/nav/NavBar';

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

const a = {
  id: 'a',
  renderContent: (navigator, routeLinks, openMenu) =>
    <LoginOrRegisterScene
      navigator={navigator}
      routeLinks={routeLinks}
      openMenu={openMenu}
      title="A"
      leftIs="menu"
      rightIs="next"
    />,
}

const b = {
  id: 'b',
  renderContent: (navigator, routeLinks, openMenu) =>
    <LoginOrRegisterScene
      navigator={navigator}
      routeLinks={routeLinks}
      openMenu={openMenu}
      title="B"
      leftIs="back"
      rightIs="next"
    />,
}

const c = {
  id: 'c',
  renderContent: (navigator, routeLinks, openMenu) =>
    <LoginOrRegisterScene
      navigator={navigator}
      routeLinks={routeLinks}
      openMenu={openMenu}
      title="C"
      leftIs="back"
      rightIs="next"
    />,
}

const d = {
  id: 'd',
  renderContent: (navigator, routeLinks, openMenu) =>
    <LoginOrRegisterScene
      navigator={navigator}
      routeLinks={routeLinks}
      openMenu={openMenu}
      title="d"
      leftIs="back"
      rightIs="next"
    />,
}

const e = {
  id: 'e',
  renderContent: (navigator, routeLinks, openMenu) =>
    <LoginOrRegisterScene
      navigator={navigator}
      routeLinks={routeLinks}
      openMenu={openMenu}
      title="e"
      leftIs="back"
      rightIs="home"
    />,
}

const routeLinks = {};

routeLinks[a.id] = {
  next: {
    title: 'go to b',
    getRoute: () => b,
  },
};

routeLinks[b.id] = {
  next: {
    title: 'go to c',
    getRoute: () => c,
  },
};

routeLinks[c.id] = {
  next: {
    title: 'go to d or e',
    getRoute: (shouldSkip) => shouldSkip ? e : d,
  },
};

routeLinks[d.id] = {
  next: {
    title: 'go to e',
    getRoute: () => e,
  },
  prev: {
    getRoute: () => b,
  },
};

routeLinks[e.id] = {
  home: {
    title: 'go home to a',
    getRoute: () => a,
  },
};

console.log("ROUTE LINKS");
console.log(routeLinks);

function NavApp() {
  return <NavBar initialRoute={a} routeLinks={routeLinks} menu={<Menu />} />;
}

function Application() {
  return <RightExpandingNavWithMenuDrawer routes={testRoutes} menu={<Menu />} />;
}

AppRegistry.registerComponent('Selbi', () => NavApp);
