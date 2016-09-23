import React from 'react';

import { registerWithEmail, signInWithEmail, getUser, createUser }
  from '../../firebase/FirebaseConnector';
import { withNavigatorProps } from '../../nav/RoutableScene';
import SimpleCamera from './CameraScene';
import ApproveImageScene from './ApproveImageScene';
import PriceInputScene from './PriceInputScene';
import TitleInputScene from './TitleInputScene';
import ChooseVisibilityScene from './ChooseVisibilityScene';
import PublishCompletedScene from './PublishCompleteScene';

import SignInOrRegisterScene from '../SignInOrRegisterScene';

import EditListingFlow from '../editListingFlow';

const loginScene = {
  id: 'login-scene',
  renderContent: withNavigatorProps(
    <SignInOrRegisterScene
      title="Wait! One more thing."
      leftIs="back"
      rightIs="next"
      registerWithEmail={registerWithEmail}
      signInWithEmail={signInWithEmail}
      createUser={createUser}
    />),
};

const titleScene = {
  id: 'title-scene',
  renderContent: withNavigatorProps(
    <TitleInputScene
      title="Create Listing (3/4)"
      leftIs="back"
      rightIs="next"
      inputTitle="What do you want to title this listing?"
      placeholder="Eg. 'Magic coffee table!'"
    />
  ),
};

const cameraScene = {
  id: 'create-camera-scene',
  renderContent: withNavigatorProps(
    <SimpleCamera
      title="Create Listing (1/4)"
      leftIs="back"
      rightIs="next"
    />),
};

const imageScene = {
  id: 'create-image-scene',
  renderContent: withNavigatorProps(
    <ApproveImageScene
      title=""
      leftIs="back"
      rightIs="next"
    />),
};

const priceInputScene = {
  id: 'price-listing',
  renderContent: withNavigatorProps(
    <PriceInputScene
      title="Create Listing (2/4)"
      leftIs="back"
      rightIs="next"
      inputTitle="How much do you want to sell for?"
      placeholder="USD"
      isNumeric
      floatingLabel
    />
  ),
};

const chooseVisibilityScene = {
  id: 'choose-visibility',
  renderContent: withNavigatorProps(
    <ChooseVisibilityScene
      title="Create Listing (4/4)"
      leftIs="back"
      rightIs="next"
    />
  ),
};

const publishCompletedScene = {
  id: 'publish-completed',
  renderContent: withNavigatorProps(
    <PublishCompletedScene
      title="Success!"
      rightIs="home"
    />
  ),
};

const routeLinks = {};

routeLinks[cameraScene.id] = {
  next: {
    title: '',
    getRoute: () => imageScene,
  },
};
routeLinks[imageScene.id] = {
  next: {
    title: 'Accept Photo',
    getRoute: () => priceInputScene,
  },
};
routeLinks[priceInputScene.id] = {
  next: {
    title: 'OK',
    getRoute: () => titleScene,
  },
};
routeLinks[titleScene.id] = {
  next: {
    title: 'OK',
    getRoute: () => {
      if (getUser()) {
        return chooseVisibilityScene;
      }
      return loginScene;
    },
  },
};
routeLinks[loginScene.id] = {
  next: {
    title: '',
    getRoute: () => chooseVisibilityScene,
  },
};
routeLinks[chooseVisibilityScene.id] = {
  next: {
    title: '',
    getRoute: () => publishCompletedScene,
  },
};
routeLinks[publishCompletedScene.id] = {
  next: {
    title: '',
    getRoute: () => EditListingFlow.firstScene,
  },
  home: {
    title: 'Done',
  },
};


module.exports.routesLinks = routeLinks;
module.exports.firstScene = cameraScene;
