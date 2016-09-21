import React, { Component } from 'react';
import { View, ListView, RefreshControl, Text } from 'react-native';

import ItemView from './ItemView';
import SpinnerOverlay from './SpinnerOverlay';
import styles from '../../styles';

export default class ListingsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
    };

    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.props.refresh()
      .then(() => {
        this.setState({ refreshing: false });
      });
  }

  render() {
    const getRefreshControl = () => {
      if (this.props.refresh) {
        return (
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        );
      }
      return undefined;
    };

    if (!this.props.listings) {
      return (
        <View style={styles.container}>
          <SpinnerOverlay isVisible message="" />
        </View>
      );
    }

    if (this.props.listings.length === 0) {
      return (
        <View style={styles.paddedCenterContainer}>
          <Text>{this.props.emptyMessage}</Text>
        </View>
      );
    }
    return (
      <ListView
        enableEmptySections
        removeClippedSubviews={false}
        refreshControl={getRefreshControl()}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
        style={styles.container}
        dataSource={new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
          .cloneWithRows(this.props.listings)}
        renderRow={(data) =>
          <ItemView
            listing={data}
            openDetailScene={this.props.openDetailScene}
          />}
      />
    );
  }
}

ListingsComponent.propTypes = {
  refresh: React.PropTypes.func,
  emptyMessage: React.PropTypes.string,
  listings: React.PropTypes.arrayOf(React.PropTypes.object),
  openDetailScene: React.PropTypes.func,
};
