import React from 'react';
import { withNavigatorProps } from '../../nav/RoutableScene';

import EnterPhoneNumberScene from './EnterPhoneNumberScene';
import EnterPhoneCodeScene from './EnterPhoneCodeScene';
import AddFriendsFromContactsScene from './AddFriendsFromContactsScene';

const phoneNumberScene = {
  id: 'phone-number-scene',
  renderContent: withNavigatorProps(
    <EnterPhoneNumberScene
      title=""
      leftIs="back"
      rightIs="next"
    />
  ),
};

const phoneCodeScene = {
  id: 'phone-code-scene',
  renderContent: withNavigatorProps(
    <EnterPhoneCodeScene
      title=""
      leftIs="back"
      rightIs="next"
    />
  ),
};

const addFriendsScene = {
  id: 'phone-add-friends',
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
