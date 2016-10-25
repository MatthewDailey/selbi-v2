import FirebaseAnalytics from 'react-native-firebase-analytics';

let Analytics = FirebaseAnalytics;
if (__DEV__) {
  Analytics = {
    logEvent: console.log,
  };
}


export default Analytics;

export function reportShare(listingId) {
  Analytics.logEvent('share', {
    item_id: listingId,
  });
}

export function reportSignIn(method, uid) {
  Analytics.logEvent('sign_in', {
    method,
    uid,
  });
}

export function reportAddBankInfo() {
  Analytics.logEvent('add_bank_info');
}

export function reportAddPaymentInfo() {
  Analytics.logEvent('add_payment_info');
}

export function reportSendMessage(senderUid, isFirst = false) {
  const params = {
    is_first: isFirst,
    sender_uid: senderUid,
  };
  if (isFirst) {
    Analytics.logEvent('sent_message_first', params);
  }
  Analytics.logEvent('sent_message', params);
}

export function reportPurchase(price, listingId) {
  const value = 0.15 * price;

  Analytics.logEvent('ecommerce_purchase', {
    value,
    price,
    listing_id: listingId,
    currency: 'USD',
  });
}

export function reportEvent(title, params) {
  Analytics.logEvent(title, params);
}

export function reportOpenScene(sceneName, params) {
  Analytics.logEvent(`open_${sceneName}`, params);
}

export function reportButtonPress(buttonName, params) {
  Analytics.logEvent(`press_${buttonName}`, params);
}

export function setUserNumItemsSold(numItemsSold) {
  Analytics.setUserProperty('n_listings_sold', `${numItemsSold}`);
}

export function setUserNumPublicItems(numItemsListed) {
  Analytics.setUserProperty('n_listings_public', `${numItemsListed}`);
}

export function setUserNumPrivateItems(numItemsListed) {
  Analytics.setUserProperty('n_listings_private', `${numItemsListed}`);
}

export function setUserNumItemsPurchased(numItemsListed) {
  Analytics.setUserProperty('n_purchases', `${numItemsListed}`);
}

export function setUserAddedBank(hasAddedBank) {
  Analytics.setUserProperty('has_added_bank', `${hasAddedBank}`);
}

export function setUserAddedCreditCard(hasAddedCreditCard) {
  Analytics.setUserProperty('has_added_cc', `${hasAddedCreditCard}`);
}

export function setUserAddedPhone(hasAddedPhone) {
  Analytics.setUserProperty('has_added_phone', `${hasAddedPhone}`);
}

export function reportError(type, params) {
  Analytics.logEvent(`error_${type}`, params);
}