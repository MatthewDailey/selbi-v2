import React from 'react';
import { View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import RoutableScene from '../nav/RoutableScene';
import SpinnerOverlay from '../components/SpinnerOverlay';

import ChatScene from '../scenes/ChatScene';
import ChatListComponent from '../components/ChatListComponent';

import { loadAllUserChats } from '../firebase/FirebaseConnector';

import styles from '../../styles';
import colors from '../../colors';

export default class ChatListScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.state = {
      allChats: [],
      buyingChats: [],
      sellingChats: [],
      loading: true,
    };

    this.loadChatData = this.loadChatData.bind(this);
  }

  componentDidMount() {
    this.loadChatData();
  }

  loadChatData() {
    return loadAllUserChats()
      .then((allUserChats) => {
        const loadedBuyingChats = allUserChats.filter(
          (chatDetails) => chatDetails.type === 'buying');
        const loadedSellingChats = allUserChats.filter(
          (chatDetails) => chatDetails.type === 'selling');
        this.setState({
          loading: false,
          allChats: allUserChats,
          buyingChats: loadedBuyingChats,
          sellingChats: loadedSellingChats,
        }, () => console.log(this.state));
      })
      .catch(console.log);
  }

  getChatListComponentForChats(chats) {
    return (
      <ChatListComponent
        refresh={this.loadChatData}
        chats={chats}
        openChatScene={(data) => this.openSimpleScene(
          <ChatScene
            title={data.listingData.title}
            chatData={data}
            leftIs="back"
          />
        )}
      />
    );
  }

  renderWithNavBar() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <SpinnerOverlay isVisible />
        </View>
      );
    }

    return (
      <ScrollableTabView
        tabBarBackgroundColor={colors.primary}
        tabBarUnderlineColor={colors.secondary}
        tabBarActiveTextColor={colors.secondary}
        style={styles.fullScreenContainer}
      >
        <View tabLabel="All" style={styles.container}>
          {this.getChatListComponentForChats(this.state.allChats)}
        </View>
        <View tabLabel="Buying" style={styles.container}>
          {this.getChatListComponentForChats(this.state.buyingChats)}
        </View>
        <View tabLabel="Selling" style={styles.container}>
          {this.getChatListComponentForChats(this.state.sellingChats)}
        </View>
      </ScrollableTabView>
    );
  }
}
