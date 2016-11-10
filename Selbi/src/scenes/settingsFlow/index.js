import React from 'react';

import AddBankFlow from '../addBankAccountFlow';

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
};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = settingsScene;
