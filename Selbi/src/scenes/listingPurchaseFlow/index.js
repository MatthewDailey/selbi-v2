import React from 'react';
import { connect } from 'react-redux';

import { withNavigatorProps } from '../../nav/RoutableScene';
import { setBuyerUid } from '../../reducers/ListingDetailReducer';

import SignInOrRegisterScene from '../SignInOrRegisterScene';
import ChatScene from '../ChatScene';
import ListingDetailScene from '../ListingDetailScene';
import ReceiptScene from './ReceiptScene';

import { registerWithEmail, signInWithEmail, getUser, createUser }
  from '../../firebase/FirebaseConnector';

import EditListingFlow from '../editListingFlow';


const chatFromDetailScene = {
  id: 'chat-details-scene',
  renderContent: withNavigatorProps(<ChatScene leftIs="back" />),
};

const listingDetailScene = {
  id: 'listing-detail-scene',
  renderContent: withNavigatorProps(<ListingDetailScene leftIs="back" rightIs="next" />),
};

const receiptScene = {
  id: 'receipt-scene',
  renderContent: withNavigatorProps(
    <ReceiptScene
      title="Confirm Purchase"
      leftIs="back"
      rightIs="return"
    />
  ),
};


const mapDispatchToProps = (dispatch) => {
  return {
    onSignedIn: (buyerUid) => dispatch(setBuyerUid(buyerUid)),
  };
};

const PurchaseFlowSignIn = connect(
  undefined,
  mapDispatchToProps
)(SignInOrRegisterScene);


const chatSignInScene = {
  id: 'chat-login-scene',
  renderContent: withNavigatorProps(
    <PurchaseFlowSignIn
      title="Sign in to chat."
      leftIs="back"
      rightIs="next"
      registerWithEmail={registerWithEmail}
      signInWithEmail={signInWithEmail}
      createUser={createUser}
    />),
};

const buySignInScene = {
  id: 'buy-login-scene',
  renderContent: withNavigatorProps(
    <PurchaseFlowSignIn
      title="Sign in to pay."
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

routeLinks[receiptScene.id] = {
  back: {
    getRoute: () => listingDetailScene,
  },
};

routeLinks[listingDetailScene.id] = {
  edit: {
    title: 'Edit',
    getRoute: () => EditListingFlow.firstScene,
  },
  chat: {
    getRoute: () => {
      if (getUser()) {
        return chatFromDetailScene;
      }
      return chatSignInScene;
    },
  },
  buy: {
    getRoute: () => {
      if (getUser()) {
        return receiptScene;
      }
      return buySignInScene;
    },
  },
};

routeLinks[chatSignInScene.id] = {
  next: {
    title: '',
    getRoute: () => chatFromDetailScene,
  },
};

routeLinks[buySignInScene.id] = {
  next: {
    title: '',
    getRoute: () => receiptScene,
  },
};

module.exports.routesLinks = routeLinks;
module.exports.firstScene = listingDetailScene;
