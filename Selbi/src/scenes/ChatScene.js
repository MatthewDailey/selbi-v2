import React from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

import RoutableScene from '../nav/RoutableScene';

import { loadUserPublicData, loadMessages, sendMessage, getUser} from '../firebase/FirebaseConnector';

import style from '../../styles';
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
    // sendMessage(this.props.chatData.listingId, this.props.chatData.buyerUid, 'auto message')
    //   .catch(console.log);
    console.log("mounting chat scene")
    const promiseBuyerPublicData = loadUserPublicData(this.props.chatData.buyerUid);
    const promiseSellerPublicData = loadUserPublicData(this.props.chatData.sellerUid);

    Promise.all([promiseBuyerPublicData, promiseSellerPublicData])
      .then((chatUserPublicData) => {
        const loadedUidToName = {};
        loadedUidToName[this.props.chatData.buyerUid] = chatUserPublicData[0].val().displayName;
        loadedUidToName[this.props.chatData.sellerUid] = chatUserPublicData[1].val().displayName;
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
        loadMessages(this.props.chatData.listingId, this.props.chatData.buyerUid)
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
  }
  onSend(messages = []) {
    console.log(this.props.chatData);
    messages.forEach((message) =>
      sendMessage(this.props.chatData.listingId, this.props.chatData.buyerUid, message.text));

    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
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