import React from 'react';
import RequestNotificationPermissionScene from './RequestNotificationPermissionScene';
import { withNavigatorProps } from '../../nav/RoutableScene';

const notificationPermissionScene = {
  id: 'intro_notif_scene',
  renderContent: withNavigatorProps(<RequestNotificationPermissionScene />),
};

const routeLinks = {};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = notificationPermissionScene;
