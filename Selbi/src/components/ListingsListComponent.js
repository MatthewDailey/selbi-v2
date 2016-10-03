import React, { Component } from 'react';
import { View, ListView, RefreshControl, Text } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import ItemView from './ItemView';
import SpinnerOverlay from './SpinnerOverlay';
import styles from '../../styles';
import colors from '../../colors';

export default class ListingsComponent extends Component {
  render() {
    const RefreshButton = MKButton.plainFab()
      .withStyle({
        borderRadius: 20,
        margin: 20,
      })
      .withOnPress(() => {
        this.props.refresh();
      })
      .build();

    if (Object.keys(this.props.listings).length === 0) {
      if (this.props.emptyView) {
        return <this.props.emptyView />;
      }

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
      </View>
    );
  }
}

ListingsComponent.propTypes = {
  refresh: React.PropTypes.func,
  emptyView: React.PropTypes.func,
  emptyMessage: React.PropTypes.string,
  listings: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
  openDetailScene: React.PropTypes.func,
};
