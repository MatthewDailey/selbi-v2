import React, { Component } from 'react';
import { ListView, RefreshControl } from 'react-native';

import ChatListItem from './ChatListItem';

import styles from '../../styles';

export default class ChatListComponent extends Component {
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
            chatTitle={data.title}
            chatType={data.type}
            openChatScene={() => this.props.openChatScene(data)}
          />)}
      />
    );
  }
}
