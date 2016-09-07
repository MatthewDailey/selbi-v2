import React, { Component } from 'react';
import { ListView, RefreshControl } from 'react-native';
import { loadImage } from '../firebase/FirebaseConnector';

import ItemView from '../scenes/ItemView';
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
            loadImage={loadImage}
            openSimpleScene={this.props.openSimpleScene}
          />}
      />
    );
  }
}

ListingsComponent.propTypes = {
  refresh: React.PropTypes.func,
  listings: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  openSimpleScene: React.PropTypes.func,
};
