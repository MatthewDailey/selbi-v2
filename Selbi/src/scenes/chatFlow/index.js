import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import ChatScene from '../listingPurchaseFlow/ChatScene';
import ListingDetailScene from '../listingPurchaseFlow/ListingDetailScene';

const chatScene = {
  id: 'chat-scene',
  renderContent: withNavigatorProps(<ChatScene leftIs="back" rightIs="next" />),
};

const detailScene = {
  id: 'chat-detail-scene',
  renderContent: withNavigatorProps(<ListingDetailScene leftIs="back" />),
};

const routeLinks = {};

routeLinks[chatScene.id] = {
  next: {
    title: 'Details',
    getRoute: () => detailScene,
  },
};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = chatScene;
