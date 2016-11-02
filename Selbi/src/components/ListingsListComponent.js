import React, { Component } from 'react';
import { View, ListView, Text, InteractionManager } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import ItemView from './ItemView';
import styles from '../../styles';

export default class ListingsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { renderPlaceholderOnly: true };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false });
    });
  }

  render() {

    if (this.state.renderPlaceholderOnly) {
      return (
        <View style={styles.container} />
      );
    }

    const RefreshButton = MKButton.plainFab()
      .withStyle({
        borderRadius: 20,
        margin: 20,
      })
      .withOnPress(() => {
        this.props.refresh();
      })
      .build();

    if (!this.props.listings || Object.keys(this.props.listings).length === 0) {
      console.log('Rendering ListingsListComponent - empty');
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

    console.log('Rendering ListingsListComponent - has listings');
    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections
          removeClippedSubviews={false}
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
          dataSource={new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
            .cloneWithRows(this.props.listings)}
          renderRow={(data) =>
            <ItemView
              listing={data}
              openDetailScene={this.props.openDetailScene}
            />}
          renderHeader={() => this.props.header}
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
