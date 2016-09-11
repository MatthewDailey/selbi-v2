import React from 'react';

import { registerWithEmail, signInWithEmail, getUser, createListing, createUser, publishImage }
  from '../../firebase/FirebaseConnector';
import { withNavigatorProps } from '../../nav/RoutableScene';
import SimpleCamera from './CameraScene';
import ApproveImageScene from './ApproveImageScene';
import PublishScene from './PublishScene';
import PriceInputScene from './PriceInputScene';
import TitleInputScene from './TitleInputScene';
import SignInOrRegisterScene from '../SignInOrRegisterScene';

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

const publishScene = {
  id: 'post-login',
  renderContent: withNavigatorProps(
    <PublishScene
      title=""
      rightIs="home"
      createListing={createListing}
      publishImage={publishImage}
    />
  ),
};

const titleScene = {
  id: 'title-scene',
  renderContent: withNavigatorProps(
    <TitleInputScene
      title="Create Listing (3/3)"
      leftIs="back"
      rightIs="next"
      inputTitle="What are you selling?"
      placeholder="Eg. 'Magic coffee table!'"
    />
  ),
};

const cameraScene = {
  id: 'b',
  renderContent: withNavigatorProps(
    <SimpleCamera
      title="Create Listing (1/3)"
      leftIs="back"
      rightIs="next"
    />),
};

const imageScene = {
  id: 'c',
  renderContent: withNavigatorProps(
    <ApproveImageScene
      title=""
      leftIs="back"
      rightIs="next"
    />),
};

const priceInputScene = {
  it: 'price-listing',
  renderContent: withNavigatorProps(
    <PriceInputScene
      title="Create Listing (2/3)"
      leftIs="back"
      rightIs="next"
      inputTitle="How much do you want to sell for?"
      placeholder="USD"
      isNumeric
      floatingLabel
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
    title: 'Post',
    getRoute: () => {
      if (getUser()) {
        return publishScene;
      }
      return loginScene;
    },
  },
};
routeLinks[loginScene.id] = {
  next: {
    title: '',
    getRoute: () => publishScene,
  },
};
routeLinks[publishScene.id] = {
  home: {
    title: 'Done',
  },
};

module.exports.routesLinks = routeLinks;
module.exports.firstScene = cameraScene;
