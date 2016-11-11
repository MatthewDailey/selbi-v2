import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import FriendsScene from './FriendsScene';
import FollowFriendScene from './FollowFriendScene';

import SellerProfileFlow from '../sellerProfileFlow';

const friendsScene = {
  id: 'friends_scene',
  renderContent: withNavigatorProps(
    <FriendsScene
      title="Friends"
      leftIs="menu"
    />),
};

const followFriendScene = {
  id: 'follow_friend_scene',
  renderContent: withNavigatorProps(
    <FollowFriendScene
      title=""
      leftIs="back"
      rightIs="return"
    />
  ),
};

const routeLinks = {};

routeLinks[friendsScene.id] = {
  addFriend: {
    getRoute: () => followFriendScene,
  },
  sellerProfile: {
    getRoute: () => SellerProfileFlow.firstScene,
  },
};

module.exports.firstScene = friendsScene;
module.exports.routeLinks = routeLinks;
