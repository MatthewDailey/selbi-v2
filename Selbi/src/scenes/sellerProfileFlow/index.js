import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import SellerProfileScene from './SellerProfileScene';

const sellerProfileScene = {
  id: 'seller-profile-scene',
  renderContent: withNavigatorProps(
    <SellerProfileScene
      leftIs="back"
    />),
};

const routeLinks = {};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = sellerProfileScene;
