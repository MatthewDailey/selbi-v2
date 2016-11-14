import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import FriendsScene from './FriendsScene';
import FollowFriendScene from './FollowFriendScene';

import SellerProfileFlow from '../sellerProfileFlow';
import AddFriendsFromContactsFlow from '../addFriendsFromContactsFlow';

const friendsScene = {
  id: 'friends_s',
  renderContent: withNavigatorProps(
    <FriendsScene
      title="Friends"
      leftIs="menu"
    />),
};

const followFriendScene = {
  id: 'follow_friend_s',
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
  syncContacts: {
    getRoute: () => AddFriendsFromContactsFlow.firstScene,
  },
};

routeLinks[followFriendScene.id] = {
  return: {
    title: 'Add Friend',
  },
};

module.exports.firstScene = friendsScene;
module.exports.routeLinks = routeLinks;
