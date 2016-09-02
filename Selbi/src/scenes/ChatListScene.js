import React, { Component } from 'react';
import { View, Text, ListView, RefreshControl, TouchableHighlight } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import RoutableScene from '../nav/RoutableScene';
import SpinnerOverlay from './SpinnerOverlay';
import ChatScene from './ChatScene';

import { loadAllUserChats } from '../firebase/FirebaseConnector'

import styles from '../../styles';
import colors from '../../colors';

function ChatListItem({ chatData, openChatScene }) {
  return (
    <TouchableHighlight
      onPress={() => openChatScene(
        <ChatScene
          title={chatData.title}
          chatData={chatData}
          leftIs="back"
        />
      )}
      underlayColor={`${colors.dark}64`}
      style={{
        padding: 16,
        flex: 1,
        borderBottomWidth: 1,
        borderColor: colors.dark,
      }}
    >
      <View>
        <Text>{chatData.type}</Text>
        <Text style={styles.friendlyTextLeft}>{chatData.title}</Text>
      </View>
    </TouchableHighlight>
  );
}

class ChatListComponent extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(props.chats),
      refreshing: false,
    };
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    console.log('called refresh chats');
    this.setState({ refreshing: true });
    this.props.refresh()
      .then(() => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.props.chats),
          refreshing: false,
        });
      });
  }

  render() {
    return (
      <ListView
        enableEmptySections
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        style={styles.container}
        removeClippedSubviews={false}
        dataSource={this.state.dataSource}
        renderRow={(data) => (
          <ChatListItem
            chatData={data}
            openChatScene={this.props.openChatScene}
          />)}
      />
    );
  }
}

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
    console.log('called load chat data');
    return loadAllUserChats()
      .then((allUserChats) => {
        console.log(allUserChats)
        const loadedBuyingChats = allUserChats.filter(
          (chatDetails) => chatDetails.type === 'buying');
        const loadedSellingChats = allUserChats.filter(
          (chatDetails) => chatDetails.type === 'selling');
        console.log(allUserChats)
        this.setState({
          loading: false,
          allChats: allUserChats,
          buyingChats: loadedBuyingChats,
          sellingChats: loadedSellingChats,
        }, () => console.log(this.state));
      });
  }

  renderWithNavBar() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <SpinnerOverlay isVisible />
        </View>
      );
    }

    console.log('rendering chatlist scene')
    return (
      <ScrollableTabView
        tabBarBackgroundColor={colors.primary}
        tabBarUnderlineColor={colors.secondary}
        tabBarActiveTextColor={colors.secondary}
        style={styles.fullScreenContainer}
      >
        <View tabLabel="All" style={styles.container}>
          <ChatListComponent
            refresh={this.loadChatData}
            chats={this.state.allChats}
            openChatScene={this.openSimpleScene}
          />
        </View>
        <View tabLabel="Buying" style={styles.container}>
          <ChatListComponent
            refresh={this.loadChatData}
            chats={this.state.buyingChats}
            openChatScene={this.openSimpleScene}
          />
        </View>
        <View tabLabel="Selling" style={styles.container}>
          <ChatListComponent
            refresh={this.loadChatData}
            chats={this.state.sellingChats}
            openChatScene={this.openSimpleScene}
          />
        </View>
      </ScrollableTabView>
    );
  }
}
