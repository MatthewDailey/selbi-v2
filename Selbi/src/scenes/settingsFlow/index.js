import React from 'react';

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
}

const routeLinks = {};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = settingsScene;
