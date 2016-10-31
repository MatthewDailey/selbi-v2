import React from 'react';
import { connect } from 'react-redux';
import { Alert, View, ActionSheetIOS, Text, TouchableHighlight } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

import RoutableScene from '../nav/RoutableScene';

import { loadUserPublicData, loadMessages, sendMessage, getUser, subscribeToNewMessages,
  createChatAsBuyer, blockUser, unblockUser } from '../firebase/FirebaseConnector';

import colors from '../../colors';
import styles from '../../styles';
import { reportSendMessage, reportEvent } from '../SelbiAnalytics';

class ChatScene extends RoutableScene {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uidToName: {},
    };
    this.onSend = this.onSend.bind(this);
  }

  convertDbMessageToUiMessage(dbMessageKey, dbMessage) {
    return {
      text: dbMessage.text,
      createdAt: dbMessage.createdAt,
      _id: dbMessageKey,
      user: {
        _id: dbMessage.authorUid,
        name: this.state.uidToName[dbMessage.authorUid],
      },
    };
  }

  getOtherUserUid() {
    const currentUserUid = getUser().uid;
    if (currentUserUid === this.props.buyerUid) {
      return this.props.listingData.sellerId;
    }
    return this.props.buyerUid;
  }

  goActionSheet() {
    const otherUserUid = this.getOtherUserUid();
    const askWouldLikeToBlockUser = () => {
      Alert.alert('Block user?',
        `Do you want to block all messages from ${this.state.uidToName[otherUserUid]}?`,
        [
          {
            text: 'Cancel',
          },
          {
            text: 'Block',
            onPress: () => {
              reportEvent('block_user');
              blockUser(otherUserUid);
            },
          },
        ]);
    };

    const buttons = [...this.props.routeLinks.actionSheet.buttons, 'Block User', 'Cancel'];
    ActionSheetIOS.showActionSheetWithOptions({
      options: buttons,
      cancelButtonIndex: buttons.length - 1,
      destructiveButtonIndex: buttons.length - 2,
    }, (buttonIndex) => {
      const buttonName = buttons[buttonIndex];
      const buttonNextRouteName = this.props.routeLinks.actionSheet
        .buttonsNextRouteName[buttonName];
      if (buttonNextRouteName) {
        this.goNext(buttonNextRouteName);
        return;
      }
      switch (buttonIndex) {
        case buttons.length - 2:
          askWouldLikeToBlockUser();
          break;
        default:
          // Do nothing.
      }
      console.log('Pressed:', buttonIndex);
    });
  }

  componentWillMount() {
    const sellerUid = this.props.listingData.sellerId;

    if (sellerUid === this.props.buyerUid) {
      // there is an emoji inline.
      Alert.alert('This is your listing. You already own this! 😀', '',
        [{ text: 'OK', onPress: this.goBack }]);
      return;
    }

    const promiseBuyerPublicData = loadUserPublicData(this.props.buyerUid);
    const promiseSellerPublicData = loadUserPublicData(sellerUid);

    Promise.all([promiseBuyerPublicData, promiseSellerPublicData])
      .then((chatUserPublicData) => {
        const loadedUidToName = {};
        loadedUidToName[this.props.buyerUid] = chatUserPublicData[0].val().displayName;
        loadedUidToName[sellerUid] = chatUserPublicData[1].val().displayName;
        return new Promise((resolve) => {
          this.setState({
            uidToName: loadedUidToName,
            user: {
              _id: getUser().uid,
              name: loadedUidToName[getUser().uid],
            },
          }, resolve);
        });
      })
      .then(() => {
        loadMessages(this.props.listingKey, this.props.buyerUid)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const allMessages = [];
              Object.keys(snapshot.val()).forEach((dbMessageKey) => {
                allMessages.unshift(
                  this.convertDbMessageToUiMessage(dbMessageKey, snapshot.val()[dbMessageKey]));
              });

              this.setState({
                messages: allMessages,
              });
            }
          });
      });

    this.setState({
      unsubscribeFunction: subscribeToNewMessages(
        this.props.listingKey,
        this.props.buyerUid,
        (newMessageSnapshot) => {
          const newMessage = this.convertDbMessageToUiMessage(
            newMessageSnapshot.key, newMessageSnapshot.val());
          this.setState((previousState) => {
            return {
              messages: GiftedChat.append(previousState.messages, [newMessage]),
            };
          });
        }
      ),
    });
  }

  componentWillUnmount() {
    if (this.state.unsubscribeFunction) {
      this.state.unsubscribeFunction();
    }
  }

  onSend(messages = []) {
    let isFirstMessageForAnalytics = false;
    if (this.state.messages.length === 0 && this.props.buyerUid === getUser().uid) {
      isFirstMessageForAnalytics = true;
      createChatAsBuyer(this.props.listingKey, this.props.listingData.sellerId);
    }

    messages.forEach((message) =>
      sendMessage(this.props.listingKey, this.props.buyerUid, message.text));

    reportSendMessage(getUser().uid, isFirstMessageForAnalytics);
  }

  renderWithNavBar() {
    if (this.props.isUserBlocked) {
      const otherUserUid = this.getOtherUserUid();
      const otherUserName = this.state.uidToName[otherUserUid];
      return (
        <TouchableHighlight
          style={styles.paddedContainer}
          onPress={() => {
            Alert.alert('Unblock user?',
              `Do you want to unblock messages from ${this.state.uidToName[otherUserUid]}?`,
              [
                {
                  text: 'Cancel',
                },
                {
                  text: 'Unblock',
                  onPress: () => {
                    reportEvent('unblock_user');
                    unblockUser(otherUserUid);
                  },
                },
              ]);
          }}
          underlayColor={`${colors.black}64`}
        >
          <View>
            <Text style={styles.friendlyText}>
              You've blocked all messages between you and {otherUserName}.
            </Text>
            <View style={styles.padded} />
            <Text style={styles.friendlyText}>Tap to unblock.</Text>
          </View>
        </TouchableHighlight>
      );
    }

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}
      >
        <GiftedChat
          messages={this.state.messages}
          user={this.state.user}
          onSend={this.onSend}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  let computedBuyerUid = state.listingDetails.buyerUid;
  if (!computedBuyerUid) {
    computedBuyerUid = getUser().uid;
  }

  const isUserBlocked = state.blockedUsers[state.listingDetails.listingData.sellerId]
    || state.blockedUsers[computedBuyerUid];

  const newProps = {
    title: state.listingDetails.listingData.title,
    listingKey: state.listingDetails.listingKey,
    listingData: state.listingDetails.listingData,
    buyerUid: computedBuyerUid,
    isUserBlocked,
  };

  // If the user is blocked, don't show the actionSheet button.
  if (isUserBlocked) {
    newProps.rightIs = 'next';
  }
  return newProps;
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatScene);
