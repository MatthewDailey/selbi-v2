import React from 'react';
import { connect } from 'react-redux';

import { withNavigatorProps } from '../../nav/RoutableScene';
import { setBuyerUid } from '../../reducers/ListingDetailReducer';

import SignInOrRegisterScene from '../SignInOrRegisterScene';
import ChatScene from '../ChatScene';
import ListingDetailScene from '../ListingDetailScene';
import EditListingScene from '../EditListingScene';

import SimpleCamera from '../newListingFlow/CameraScene';
import ApproveImageScene from '../newListingFlow/ApproveImageScene';

import { registerWithEmail, signInWithEmail, getUser, createUser }
  from '../../firebase/FirebaseConnector';


const chatFromDetailScene = {
  id: 'chat-details-scene',
  renderContent: withNavigatorProps(<ChatScene leftIs="back" />),
};

const listingDetailScene = {
  id: 'listing-detail-scene',
  renderContent: withNavigatorProps(<ListingDetailScene leftIs="back" rightIs="next" />),
};

const editListingScene = {
  id: 'edit-listing-scene',
  renderContent: withNavigatorProps(<EditListingScene leftIs="back" rightIs="home" />),
};

const cameraScene = {
  id: 'edit-camera-scene',
  renderContent: withNavigatorProps(
    <SimpleCamera
      title="New Picture"
      leftIs="back"
      rightIs="next"
    />),
};

const imageScene = {
  id: 'edit-image-scene',
  renderContent: withNavigatorProps(
    <ApproveImageScene
      title=""
      leftIs="back"
      rightIs="return"
    />),
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignedIn: (buyerUid) => dispatch(setBuyerUid(buyerUid)),
  };
};

const ChatSignIn = connect(
  undefined,
  mapDispatchToProps
)(SignInOrRegisterScene);


const chatSignInScene = {
  id: 'chat-login-scene',
  renderContent: withNavigatorProps(
    <ChatSignIn
      title="Sign in to chat."
      leftIs="back"
      rightIs="next"
      registerWithEmail={registerWithEmail}
      signInWithEmail={signInWithEmail}
      createUser={createUser}
    />),
};

const routeLinks = {};

routeLinks[chatFromDetailScene.id] = {
  back: {
    getRoute: () => listingDetailScene,
  },
};

routeLinks[listingDetailScene.id] = {
  edit: {
    title: 'Edit',
    getRoute: () => editListingScene,
  },
  chat: {
    getRoute: () => {
      if (getUser()) {
        return chatFromDetailScene;
      }
      return chatSignInScene;
    },
  },
};

routeLinks[editListingScene.id] = {
  camera: {
    getRoute: () => cameraScene,
  },
  home: {
    title: 'Save',
  },
};

routeLinks[chatSignInScene.id] = {
  next: {
    title: '',
    getRoute: () => chatFromDetailScene,
  },
};

routeLinks[cameraScene.id] = {
  next: {
    title: '',
    getRoute: () => imageScene,
  },
};

routeLinks[imageScene.id] = {
  return: {
    title: 'Accept Photo',
    getRoute: () => editListingScene,
  },
};

module.exports.routesLinks = routeLinks;
module.exports.firstScene = listingDetailScene;
