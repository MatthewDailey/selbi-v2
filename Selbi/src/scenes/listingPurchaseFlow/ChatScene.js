import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

import RoutableScene from '../../nav/RoutableScene';

import { loadUserPublicData, loadMessages, sendMessage, getUser, subscribeToNewMessages }
  from '../../firebase/FirebaseConnector';

import colors from '../../../colors';

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

  componentWillMount() {
    const sellerUid = this.props.listingData.sellerId;
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
    messages.forEach((message) =>
      sendMessage(this.props.listingKey, this.props.buyerUid, message.text));
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

const mapStateToProps = (state) => {
  return {
    title: state.listingDetails.listingData.title,
    listingKey: state.listingDetails.listingKey,
    listingData: state.listingDetails.listingData,
    buyerUid: state.listingDetails.buyerUid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatScene);
