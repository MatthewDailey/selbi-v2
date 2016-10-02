import React, { Component } from 'react';
import { View, ListView, RefreshControl, Text } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import ItemView from './ItemView';
import SpinnerOverlay from './SpinnerOverlay';
import styles from '../../styles';
import colors from '../../colors';

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
      })
      .catch(console.log);
  }

  render() {
    if (!this.props.listings) {
      return (
        <View style={styles.container}>
          <SpinnerOverlay isVisible message="" />
        </View>
      );
    }

    const RefreshButton = MKButton.plainFab()
      .withStyle({
        borderRadius: 20,
        margin: 20,
      })
      .withOnPress(() => {
        console.log('pressed that button')
        this.onRefresh();
      })
      .build();

    if (this.props.listings.length === 0) {
      const getRefreshButton = () => {
        if (this.props.refresh) {
          return (
            <RefreshButton>
              <Text><Icon name="refresh" size={16} /></Text>
            </RefreshButton>
          );
        }
        return undefined;
      };
      return (
        <View style={styles.paddedCenterContainer}>
          <Text>{this.props.emptyMessage}</Text>
          {getRefreshButton()}
          <SpinnerOverlay isVisible={this.state.refreshing} message="" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections
          removeClippedSubviews={false}
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
          dataSource={new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
            .cloneWithRows(this.props.listings)}
          renderRow={(data) =>
            <ItemView
              listing={data}
              openDetailScene={this.props.openDetailScene}
            />}
        />
        <SpinnerOverlay isVisible={this.state.refreshing} message="" />
      </View>
    );
  }
}

ListingsComponent.propTypes = {
  refresh: React.PropTypes.func,
  emptyMessage: React.PropTypes.string,
  listings: React.PropTypes.arrayOf(React.PropTypes.object),
  openDetailScene: React.PropTypes.func,
};
