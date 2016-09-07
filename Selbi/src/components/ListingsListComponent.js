import React, { Component } from 'react';
import { ListView, RefreshControl } from 'react-native';
import { loadImage } from '../firebase/FirebaseConnector';

import ItemView from '../scenes/ItemView';
import styles from '../../styles';

export default class ListingsComponent extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds,
      refreshing: false,
    };

    this.loadData();
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    console.log('called refresh listings');
    this.setState({ refreshing: true });
    this.loadData()
      .then(() => {
        this.setState({ refreshing: false });
      });
  }

  loadData() {
    return this.props.fetchData()
      .then((listings) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(listings),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <ListView
        enableEmptySections
        removeClippedSubviews={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={(data) =>
          <ItemView
            listing={data}
            loadImage={loadImage}
            openSimpleScene={this.props.openSimpleScene}
          />}
      />
    );
  }
}
