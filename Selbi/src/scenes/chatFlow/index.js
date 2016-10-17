import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import ChatScene from '../ChatScene';
import ListingDetailScene from '../ListingDetailScene';

const chatScene = {
  id: 'chat_scene',
  renderContent: withNavigatorProps(<ChatScene leftIs="back" rightIs="next" />),
};

const detailScene = {
  id: 'chat_listing_detail_scene',
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
