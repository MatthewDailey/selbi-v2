import React, { Component } from 'react';
import { View, ListView, RefreshControl } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import RoutableScene from '../nav/RoutableScene';

import styles from '../../styles';
import colors from '../../colors';

class ChatListItem extends Component {
  render() {
    returns (
      <Text>A chat</Text>
    );
  }
}

class ChatListComponent extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(this.props.chats),
      refreshing: false,
    };

    this._onRefresh = this._onRefresh.bind(this);
  }

  _onRefresh() {
    console.log('called refresh chats');
    this.setState({ refreshing: true });
    this.props.refresh()
      .then(() => {
        this.setState({ refreshing: false });
      });
  }

  render() {
    return (
      <ListView
        enableEmptySections
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={(data) => <ChatListItem />}
      />
    );
  }
}


export default class ChatScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.state = {
      allChats: [],
      buyingChats: [],
      sellingChats: [],
    };

    this.loadChatData = this.loadChatData.bind(this);
  }

  loadChatData() {
    console.log('called load chat data');
    return Promise.resolve();
  }

  renderWithNavBar() {
    return (
      <ScrollableTabView
        tabBarBackgroundColor={colors.primary}
        tabBarUnderlineColor={colors.secondary}
        tabBarActiveTextColor={colors.secondary}
        style={styles.fullScreenContainer}
      >
        <View tabLabel="All" style={styles.container}>
          <ChatListComponent refresh={this.loadChatData} chats={this.state.allChats} />
        </View>
        <View tabLabel="Buying" style={styles.container}>
          <ChatListComponent refresh={this.loadChatData} chats={this.state.buyingChats} />
        </View>
        <View tabLabel="Selling" style={styles.container}>
          <ChatListComponent refresh={this.loadChatData} chats={this.state.sellingChats} />
        </View>
      </ScrollableTabView>
    );
  }
}
