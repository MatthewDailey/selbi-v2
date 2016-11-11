import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import CreditCardInputScene from './CreditCardInputScene';
import AddCreditCardEmailScene from './AddCreditCardEmailScene';

const creditCardInputScene = {
  id: 'settings_input_credit_card_scene',
  renderContent: withNavigatorProps(
    <CreditCardInputScene
      title="Add Credit Card (2/2)"
      leftIs="back"
    />),
};

const addEmailScene = {
  id: 'settings_input_credit_card_email_scene',
  renderContent: withNavigatorProps(
    <AddCreditCardEmailScene
      leftIs="back"
      rightIs="next"
      title="Add Credit Card (1/2)"
    />),
};

const routeLinks = {};

routeLinks[addEmailScene.id] = {
  next: {
    title: 'OK',
    getRoute: () => creditCardInputScene,
  },
};

routeLinks[creditCardInputScene.id] = {
  return: {
    numScenes: 2,
  },
};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = addEmailScene;
