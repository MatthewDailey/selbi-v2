import React from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

import RoutableScene from '../nav/RoutableScene';

import { loadUserPublicData, loadMessages, sendMessage, getUser, subscribeToNewMessages }
  from '../firebase/FirebaseConnector';

import colors from '../../colors';

export default class ChatScene extends RoutableScene {
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

  componentWillMount() {
    const sellerUid = this.props.chatData.listingData.sellerId;
    const promiseBuyerPublicData = loadUserPublicData(this.props.chatData.buyerUid);
    const promiseSellerPublicData = loadUserPublicData(sellerUid);

    Promise.all([promiseBuyerPublicData, promiseSellerPublicData])
      .then((chatUserPublicData) => {
        const loadedUidToName = {};
        loadedUidToName[this.props.chatData.buyerUid] = chatUserPublicData[0].val().displayName;
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
        loadMessages(this.props.chatData.listingKey, this.props.chatData.buyerUid)
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
        this.props.chatData.listingKey,
        this.props.chatData.buyerUid,
        (newMessageSnapshot) => {
          const newMessagee = this.convertDbMessageToUiMessage(
            newMessageSnapshot.key, newMessageSnapshot.val());
          this.setState((previousState) => {
            return {
              messages: GiftedChat.append(previousState.messages, [newMessagee]),
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
    console.log(this.props.chatData);
    messages.forEach((message) =>
      sendMessage(this.props.chatData.listingKey, this.props.chatData.buyerUid, message.text));
  }

  renderWithNavBar() {
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