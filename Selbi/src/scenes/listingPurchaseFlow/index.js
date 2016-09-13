import React from 'react';
import { connect } from 'react-redux';

import { withNavigatorProps } from '../../nav/RoutableScene';
import { setBuyerUid } from '../../reducers/ListingDetailReducer';

import SignInOrRegisterScene from '../SignInOrRegisterScene';
import ChatScene from '../ChatScene';
import ListingDetailScene from '../ListingDetailScene';
import EditListingScene from '../EditListingScene';

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
  renderContent: withNavigatorProps(<EditListingScene leftIs="back" />),
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

routeLinks[chatSignInScene.id] = {
  next: {
    title: '',
    getRoute: () => chatFromDetailScene,
  },
};

module.exports.routesLinks = routeLinks;
module.exports.firstScene = listingDetailScene;
