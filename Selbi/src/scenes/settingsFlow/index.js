import React from 'react';

import AddBankFlow from '../addBankAccountFlow';
import AddCreditCardFlow from '../addCreditCardFlow';

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

const routeLinks = {};

routeLinks[settingsScene.id] = {
  bank: {
    getRoute: () => AddBankFlow.firstScene,
  },
  creditCard: {
    getRoute: () => AddCreditCardFlow.firstScene,
  }
};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = settingsScene;
