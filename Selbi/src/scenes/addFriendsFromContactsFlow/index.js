import React from 'react';
import { withNavigatorProps } from '../../nav/RoutableScene';

import EnterPhoneNumberScene from './EnterPhoneNumberScene';
import EnterPhoneCodeScene from './EnterPhoneCodeScene';
import AddFriendsFromContactsScene from './AddFriendsFromContactsScene';

const phoneNumberScene = {
  id: 'i_phone_number_s',
  renderContent: withNavigatorProps(
    <EnterPhoneNumberScene
      title=""
      leftIs="back"
      rightIs="next"
    />
  ),
};

const phoneCodeScene = {
  id: 'i_phone_code_s',
  renderContent: withNavigatorProps(
    <EnterPhoneCodeScene
      title=""
      leftIs="back"
      rightIs="next"
    />
  ),
};

const addFriendsScene = {
  id: 'phone_add_friends_s',
  renderContent: withNavigatorProps(
    <AddFriendsFromContactsScene
      title=""
      leftIs="back"
      rightIs="home"
    />
  ),
};

const routeLinks = {};

routeLinks[phoneNumberScene.id] = {
  next: {
    title: 'Submit ',
    getRoute: () => phoneCodeScene,
  },
};

routeLinks[phoneCodeScene.id] = {
  next: {
    title: 'Submit',
    getRoute: () => addFriendsScene,
  },
};

routeLinks[addFriendsScene.id] = {
  home: {
    title: 'Done',
  },
};

module.exports.firstScene = phoneNumberScene;
module.exports.routeLinks = routeLinks;
