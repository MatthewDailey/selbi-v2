import React from 'react';
import { connect } from 'react-redux';

import { withNavigatorProps } from '../../nav/RoutableScene';

import SellerProfileScene from './SellerProfileScene';

import { setBuyerUid } from '../../reducers/ListingDetailReducer';

import SignInOrRegisterScene from '../SignInOrRegisterScene';
import ChatScene from '../ChatScene';
import ListingDetailScene from '../ListingDetailScene';

import ReceiptScene from '../listingPurchaseFlow/ReceiptScene';
import CreditCardInputScene from '../addCreditCardFlow/CreditCardInputScene';
import CompletedPurchaseScene from '../listingPurchaseFlow/CompletedPurchaseScene';
import AddEmailScene from '../addCreditCardFlow/AddCreditCardEmailScene';

import { registerWithEmail, signInWithEmail, getUser, createUser }
  from '../../firebase/FirebaseConnector';


const sellerProfileScene = {
  id: 'seller_profile_s',
  renderContent: withNavigatorProps(
    <SellerProfileScene
      leftIs="back"
    />),
};

const chatFromDetailScene = {
  id: 'sp_details_chat_s',
  renderContent: withNavigatorProps(<ChatScene leftIs="back" rightIs="actionSheet" />),
};

const chatFromReceiptScene = {
  id: 'sp_receipt_chat_s',
  renderContent: withNavigatorProps(<ChatScene leftIs="back" rightIs="actionSheet" />),
};

const listingDetailScene = {
  id: 'sp_detail_s',
  renderContent: withNavigatorProps(<ListingDetailScene leftIs="back" rightIs="next" />),
};

const addEmailScene = {
  id: 'i_sp_cc_email_s',
  renderContent: withNavigatorProps(
    <AddEmailScene
      leftIs="back"
      rightIs="next"
      title="Add Credit Card (1/2)"
    />),
};

const receiptScene = {
  id: 'sp_receipt_s',
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
  id: 'sp_signin_chat_s',
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
  id: 'sp_signin_buy_s',
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

const creditCardInputScene = {
  id: 'i_sp_cc_s',
  renderContent: withNavigatorProps(
    <CreditCardInputScene
      title="Add Credit Card (2/2)"
      leftIs="back"
    />),
};

const completedPurchaseScene = {
  id: 'sp_completed_purchase_s',
  renderContent: withNavigatorProps(
    <CompletedPurchaseScene
      title="Purchase Complete"
      leftIs="back"
      rightIs="home"
    />
  ),
};


const routeLinks = {};

routeLinks[chatFromDetailScene.id] = {
  back: {
    getRoute: () => listingDetailScene,
  },
  actionSheet: {
    buttons: [],
    buttonsNextRouteName: {},
  },
};

routeLinks[addEmailScene.id] = {
  next: {
    title: 'OK',
    getRoute: () => creditCardInputScene,
  },
};

routeLinks[creditCardInputScene.id] = {
  return: {
    getRoute: () => receiptScene,
  },
};

routeLinks[receiptScene.id] = {
  back: {
    getRoute: () => listingDetailScene,
  },
  addPayment: {
    getRoute: () => addEmailScene,
  },
  chat: {
    getRoute: () => chatFromReceiptScene,
  },
  next: {
    title: '',
    getRoute: () => completedPurchaseScene,
  },
};

routeLinks[chatFromReceiptScene.id] = {
  actionSheet: {
    buttons: [],
    buttonsNextRouteName: {},
  },
};

routeLinks[listingDetailScene.id] = {
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

routeLinks[completedPurchaseScene.id] = {
  back: {
    getRoute: () => listingDetailScene,
  },
};

routeLinks[sellerProfileScene.id] = {
  details: {
    getRoute: () => listingDetailScene,
  },
};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = sellerProfileScene;
