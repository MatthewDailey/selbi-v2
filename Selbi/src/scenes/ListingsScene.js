import React, { Component } from 'react';
import { ListView, RefreshControl } from 'react-native';

import { loadListingByLocation, loadImage } from '../firebase/FirebaseConnector';
import RoutableScene from '../nav/RoutableScene';
import ItemView from './ItemView';

import styles from '../../styles';

export default class ListingsScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.getGeolocation = this.getGeolocation.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  getGeolocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          // Code: 1 = permission denied, 2 = unavailable, 3 = timeout.
          reject(error.message);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
    });
  }

  fetchData() {
    return this.getGeolocation().then((latlon) => loadListingByLocation(latlon, 20));
  }

  renderWithNavBar() {
    return <ListingsComponent fetchData={this.fetchData} />;
  }
}

export class ListingsComponent extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds,
      refreshing: false,
    };

    this.loadData();
    this._onRefresh = this._onRefresh.bind(this);
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

  _onRefresh() {
    console.log('called refresh listings');
    this.setState({ refreshing: true });
    this.props.loadData()
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
        renderRow={(data) => <ItemView listing={data} loadImage={loadImage} />}
      />
    );
  }
}
