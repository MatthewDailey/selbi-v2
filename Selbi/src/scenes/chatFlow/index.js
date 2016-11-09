import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import ListingPurchaseFlow from '../listingPurchaseFlow';

import ChatScene from '../ChatScene';

const chatScene = {
  id: 'chat_scene',
  renderContent: withNavigatorProps(<ChatScene leftIs="back" rightIs="actionSheet" />),
};

const routeLinks = {};

routeLinks[chatScene.id] = {
  details: {
    title: 'Details',
    getRoute: () => ListingPurchaseFlow.firstScene,
  },
  actionSheet: {
    buttons: ['Details'],
    buttonsNextRouteName: {
      Details: 'details',
    },
  },
};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = chatScene;
