import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import FriendsScene from './FriendsScene';

const friendsScene = {
  id: 'friends_scene',
  renderContent: withNavigatorProps(
    <FriendsScene
      title="Friends"
      leftIs="menu"
    />),
};

const routeLinks = {};

module.exports.firstScene = friendsScene;
module.exports.routeLinks = routeLinks;
