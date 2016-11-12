import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import CreditCardInputScene from './CreditCardInputScene';
import AddCreditCardEmailScene from './AddCreditCardEmailScene';

const creditCardInputScene = {
  id: 'i_settings_cc_s',
  renderContent: withNavigatorProps(
    <CreditCardInputScene
      title="Add Credit Card (2/2)"
      leftIs="back"
    />),
};

const addEmailScene = {
  id: 'i_settings_cc_email_s',
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
