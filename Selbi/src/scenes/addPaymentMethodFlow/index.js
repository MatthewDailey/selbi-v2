import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import CreditCardInputScene from './CreditCardInputScene';


const creditCardInputScene = {
  id: 'credit-card-input-scene',
  renderContent: withNavigatorProps(
    <CreditCardInputScene
      title="Add Payment Method"
      leftIs="back"
    />),
};

const routeLinks = {};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = creditCardInputScene;
