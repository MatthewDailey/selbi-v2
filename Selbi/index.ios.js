import React, { Component } from 'react';
import { AppRegistry, Text } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { setTheme } from 'react-native-material-kit';
import codePush from 'react-native-code-push';
import Icon from 'react-native-vector-icons/FontAwesome';

import SignInOrRegisterScene from './src/scenes/SignInOrRegisterScene';

import Menu from './src/nav/Menu';
import DrawerNavigator from './src/nav/DrawerNavigator';
import { withNavigatorProps } from './src/nav/RoutableScene';

import NewListingFlow from './src/scenes/newListingFlow';
import ListingPurchaseFlow from './src/scenes/listingPurchaseFlow';
import ChatFlow from './src/scenes/chatFlow';
import EditListingFlow from './src/scenes/editListingFlow';
import AddBankFlow from './src/scenes/addBankAccountFlow';
import AddPhoneFlow from './src/scenes/addFriendsFromContactsFlow';

import LocalListingScene from './src/scenes/rootScenes/LocalListingsScene';
import ChatListScene from './src/scenes/rootScenes/ChatListScene';
import MyListingsScene from './src/scenes/rootScenes/MyListingsScene';
import FriendsListingsScene from './src/scenes/rootScenes/FriendsListingsScene';

import ListingLinkListener from './src/deeplinking/OpenListingDeepLinkListener';
import FollowFriendScene from './src/scenes/FollowFriendScene';

import newListingReducer from './src/reducers/NewListingReducer';
import localListingsReducer, { addLocalListing, removeLocalListing }
  from './src/reducers/LocalListingsReducer';
import myListingsReducer, { setMyListingsPrivate, setMyListingsPublic, setMyListingsSold,
  clearMyListings } from './src/reducers/MyListingsReducer';
import imagesReducer from './src/reducers/ImagesReducer';
import listingDetailReducer from './src/reducers/ListingDetailReducer';
import followFriendReducer from './src/reducers/FollowFriendReducer';
import friendsListingsReducer from './src/reducers/FriendsListingsReducer';
import userReducer, { setUserData, clearUserData } from './src/reducers/UserReducer';
import addCreditCardReducer from './src/reducers/AddCreditCardReducer';
import addBankAccountReducer from './src/reducers/AddBankAccountReducer';
import bulletinsReducer, { clearBulletins, setBulletins } from './src/reducers/BulletinsReducer';
import permissionsReducer from './src/reducers/PermissionsReducer';
import addPhoneReducer from './src/reducers/AddFriendsFromContactsReducer';
import blockedUsersReducer, { setBlockedUsers, clearBlockedUsers }
  from './src/reducers/BlockedUsersReducer';

import { registerWithEmail, signInWithEmail, signOut, getUser, createUser, watchUserPublicData,
  addAuthStateChangeListener, listenToListingsByStatus, listenToListingsByLocation,
  listenToBulletins, setUserFcmToken, createShouldAddPhoneBulletin, watchUserData,
  listenToBlockedUsers }
  from './src/firebase/FirebaseConnector';
import { subscribeToFcmTokenRefresh, unsubscribeFromFcmTokenRefresh, setBadgeNumber }
  from './src/firebase/FcmListener';

import { getGeolocation, watchGeolocation } from './src/utils';

import colors from './colors';
import config from './config';

import Analytics, { setUserAddedBank, setUserAddedCreditCard, setUserAddedPhone,
  setUserNumItemsPurchased, setUserNumItemsSold, setUserNumPrivateItems, setUserNumPublicItems }
  from './src/SelbiAnalytics';

// Necessary for code-push to not error out.
const RCTLog = require('RCTLog');

// Used to set camera shutter button color.
setTheme({
  accentColor: colors.accent,
  primaryColor: colors.primary,
});

const store = createStore(combineReducers({
  newListing: newListingReducer,
  localListings: localListingsReducer,
  myListings: myListingsReducer,
  images: imagesReducer,
  listingDetails: listingDetailReducer,
  followFriend: followFriendReducer,
  friendsListings: friendsListingsReducer,
  user: userReducer,
  addCreditCard: addCreditCardReducer,
  addBank: addBankAccountReducer,
  bulletins: bulletinsReducer,
  permissions: permissionsReducer,
  addPhone: addPhoneReducer,
  blockedUsers: blockedUsersReducer,
}));

let startedListeningForLocalListings = false;
function fetchLocalListings() {
  if (!startedListeningForLocalListings) {
    getGeolocation()
      .then((location) => {
        const geoQuery =
          listenToListingsByLocation(
            [location.lat, location.lon],
            200,
            (listing) => store.dispatch(addLocalListing(listing)),
            (listingId) => store.dispatch(removeLocalListing(listingId)));

        watchGeolocation((newLocation) => {
          if (geoQuery) {
            this.cancelGeoWatch = geoQuery.updateCriteria({
              center: [newLocation.lat, newLocation.lon],
            });
          }
        });
      })
      .then(() => startedListeningForLocalListings = true)
      .catch((error) => {
        startedListeningForLocalListings = false;
        console.log(error);
      });
  }
}
fetchLocalListings();

let unwatchUserBulletins;
const listenForUserBulletins = (user) => {
  if (user) {
    unwatchUserBulletins = listenToBulletins(
      (bulletins) => {
        // TODO: Super hack to add bulletin. Should add 'sign-in' event.
        let hasAddPhoneBulletin = false;
        let hasReadAddPhoneBulletin = false;
        let unreadBulletinCount = 0;
        Object.keys(bulletins).forEach((key) => {
          if (bulletins[key].status === 'unread') {
            unreadBulletinCount++;
          }

          if (bulletins[key].type === 'should-add-phone') {
            hasAddPhoneBulletin = true;
            hasReadAddPhoneBulletin = bulletins[key].status === 'read';
          }
        });
        if (hasAddPhoneBulletin) {
          setUserAddedPhone(hasReadAddPhoneBulletin);
        } else {
          createShouldAddPhoneBulletin();
          setUserAddedPhone(false);
        }

        setBadgeNumber(unreadBulletinCount);
        store.dispatch(setBulletins(bulletins));
      });
  } else {
    if (unwatchUserBulletins) {
      unwatchUserBulletins();
    }
    store.dispatch(clearBulletins());
  }
};
addAuthStateChangeListener(listenForUserBulletins);

let unwatchBlockedUsers;
const listenForBlockedUsers = (user) => {
  if (user) {
    unwatchBlockedUsers = listenToBlockedUsers((blockedUsers) =>
      store.dispatch(setBlockedUsers(blockedUsers)));
  } else {
    if (unwatchBlockedUsers) {
      unwatchBlockedUsers();
    }
    store.dispatch(clearBlockedUsers());
  }
};
addAuthStateChangeListener(listenForBlockedUsers)

let unwatchUserForAnalytics;
const listenForUserAnalytics = (user) => {
  if (user) {
    unwatchUserForAnalytics = watchUserData((userData) => {
      if (userData.payments && userData.payments.status === 'OK') {
        setUserAddedCreditCard(true);
      } else {
        setUserAddedCreditCard(false);
      }

      if (userData.merchant && userData.merchant.state === 'OK') {
        setUserAddedBank(true);
      } else {
        setUserAddedBank(false);
      }

      let purchaseCount = 0;
      if (userData.purchases) {
        Object.keys(userData.purchases).forEach((key) => {
          if (userData.purchases[key].status === 'success') {
            purchaseCount++;
          }
        });
      }
      setUserNumItemsPurchased(purchaseCount);
    });
  } else if (unwatchUserForAnalytics) {
    unwatchUserForAnalytics();
  }
};
addAuthStateChangeListener(listenForUserAnalytics);

// Listen for user listings and make sure to remove listener when
const listenForUserListings = (user) => {
  if (user) {
    listenToListingsByStatus('public',
      (listings) => {
        setUserNumPublicItems(listings.length);
        store.dispatch(setMyListingsPublic(listings))
      });
    listenToListingsByStatus('private',
      (listings) => {
        setUserNumPrivateItems(listings.length);
        store.dispatch(setMyListingsPrivate(listings))
      });
    listenToListingsByStatus('sold',
      (listings) => {
        setUserNumItemsSold(listings.length);
        store.dispatch(setMyListingsSold(listings))
      });
  } else {
    store.dispatch(clearMyListings());
  }
};
addAuthStateChangeListener(listenForUserListings);

const recordUserForAnalytics = (user) => {
  if (user) {
    Analytics.setUserId(user.uid);
  } else {
    Analytics.setUserId(null);
  }
};
addAuthStateChangeListener(recordUserForAnalytics);

const listenForUserFcmToken = (user) => {
  if (user) {
    subscribeToFcmTokenRefresh(setUserFcmToken);
  } else {
    unsubscribeFromFcmTokenRefresh();
  }
};
addAuthStateChangeListener(listenForUserFcmToken);

let unwatchUserPublicData;
const storeUserData = (user) => {
  if (user) {
    unwatchUserPublicData = watchUserPublicData(user.uid,
      (publicDataSnapshot) => {
        if (publicDataSnapshot.exists()) {
          const userPublicData = publicDataSnapshot.val();
          store.dispatch(setUserData(userPublicData));
        } else {
          store.dispatch(clearUserData());
        }
      });
  } else {
    if (unwatchUserPublicData) {
      unwatchUserPublicData();
    }
    store.dispatch(clearUserData());
  }
};
addAuthStateChangeListener(storeUserData);

const localListingScene = {
  id: 'local_listings_scene',
  renderContent: withNavigatorProps(
    <LocalListingScene
      title="Local Listings"
      leftIs="menu"
      rightIs="next"
      startWatchingLocalListings={fetchLocalListings}
    />),
};

const myListingsScene = {
  id: 'my_listings_scene',
  renderContent: withNavigatorProps(
    <MyListingsScene
      title="My Listings"
      leftIs="menu"
      rightIs="next"
    />
  ),
};

const chatListScene = {
  id: 'chat_list_scene',
  renderContent: withNavigatorProps(
    <ChatListScene
      title="Chats"
      leftIs="menu"
    />
  ),
};

const friendsListingScene = {
  id: 'friends_listings_scene',
  renderContent: withNavigatorProps(
    <FriendsListingsScene
      title="Friends' Listings"
      leftIs="menu"
      rightIs="next"
    />
  ),
};

const followFriendScene = {
  id: 'follow_friend_scene',
  renderContent: withNavigatorProps(
    <FollowFriendScene
      title=""
      leftIs="back"
      rightIs="return"
    />
  ),
};

const menuSignInScene = {
  id: 'menu_sign_in_scene',
  renderContent: withNavigatorProps(
    <SignInOrRegisterScene
      title=""
      leftIs="back"
      registerWithEmail={registerWithEmail}
      signInWithEmail={signInWithEmail}
      createUser={createUser}
      goHomeOnComplete
    />),
};

let routeLinks = {};

// Link local listings to sell flow.
routeLinks[localListingScene.id] = {
  next: {
    title: 'Sell',
    getRoute: () => NewListingFlow.firstScene,
  },
  details: {
    getRoute: () => ListingPurchaseFlow.firstScene,
  },
  signIn: {
    getRoute: () => menuSignInScene,
  },
  addBank: {
    getRoute: () => AddBankFlow.firstScene,
  },
  addPhone: {
    getRoute: () => AddPhoneFlow.firstScene,
  },
  chat: {
    getRoute: () => ChatFlow.firstScene,
  },
};

routeLinks[friendsListingScene.id] = {
  next: {
    title: <Text><Icon name="user-plus" size={20} /></Text>,
    getRoute: () => followFriendScene,
  },
  details: {
    getRoute: () => ListingPurchaseFlow.firstScene,
  },
};

routeLinks[myListingsScene.id] = {
  next: {
    title: 'Sell',
    getRoute: () => NewListingFlow.firstScene,
  },
  details: {
    getRoute: () => ListingPurchaseFlow.firstScene,
  },
};

routeLinks[chatListScene.id] = {
  chat: {
    getRoute: () => ChatFlow.firstScene, // Must be logged in to see chat list scene.
  },
};

routeLinks[followFriendScene.id] = {
  return: {
    title: 'Add Friend',
  },
};

routeLinks = Object.assign(routeLinks, NewListingFlow.routesLinks);
routeLinks = Object.assign(routeLinks, ListingPurchaseFlow.routesLinks);
routeLinks = Object.assign(routeLinks, ChatFlow.routeLinks);
routeLinks = Object.assign(routeLinks, EditListingFlow.routeLinks);
routeLinks = Object.assign(routeLinks, AddBankFlow.routeLinks);
routeLinks = Object.assign(routeLinks, AddPhoneFlow.routeLinks);

function renderMenu(navigator, closeMenu) {
  return (
    <Menu
      navigator={navigator}
      signOut={signOut}
      getUser={getUser}
      closeMenu={closeMenu}
      localListingScene={localListingScene}
      friendsListingScene={friendsListingScene}
      myListingScene={myListingsScene}
      chatListScene={chatListScene}
      followFriendScene={followFriendScene}
      loadUserPublicData={watchUserPublicData}
      signInOrRegisterScene={menuSignInScene}
      sellScene={NewListingFlow.firstScene}
    />
  );
}

function renderDeepLinkListener(navigator) {
  return (
    <ListingLinkListener
      navigator={navigator}
      rootScene={localListingScene}
      detailScene={ListingPurchaseFlow.firstScene}
    />
  );
}

class NavApp extends Component {
  componentDidMount() {
    if (config.codePushKey) {
      this.refreshCode = setInterval(() => {
        codePush.sync({
          updateDialog: true,
          deploymentKey: config.codePushKey,
          installMode: codePush.InstallMode.IMMEDIATE,
        });
      },
      5000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.refreshCode);
  }

  render() {
    return (
      <Provider store={store}>
        <DrawerNavigator
          initialRoute={localListingScene}
          routeLinks={routeLinks}
          renderMenuWithNavigator={renderMenu}
          renderDeepLinkListener={renderDeepLinkListener}
        />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Selbi', () => NavApp);
