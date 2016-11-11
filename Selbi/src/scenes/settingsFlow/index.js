import React from 'react';

import AddBankFlow from '../addBankAccountFlow';
import AddCreditCardFlow from '../addCreditCardFlow';

import NewEmailInputScene from './NewEmailInputScene';

import { withNavigatorProps } from '../../nav/RoutableScene';

import SettingsScene from './SettingsScene';

const settingsScene = {
  id: 'settings_scene',
  renderContent: withNavigatorProps(
    <SettingsScene
      title="Settings"
      leftIs="back"
    />
  ),
};

const newEmailInputScene = {
  id: 'new_email_input_scene',
  renderContent: withNavigatorProps(
    <NewEmailInputScene
      title="Update Email"
      leftIs="back"
      rightIs="next"
    />
  ),
};

const routeLinks = {};

routeLinks[settingsScene.id] = {
  bank: {
    getRoute: () => AddBankFlow.firstScene,
  },
  creditCard: {
    getRoute: () => AddCreditCardFlow.firstScene,
  },
  email: {
    getRoute: () => newEmailInputScene,
  },
};

routeLinks[newEmailInputScene.id] = {
  next: {
    title: 'Save',
  },
};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = settingsScene;
