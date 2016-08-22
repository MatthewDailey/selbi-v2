import React, { Component } from 'react';
import { ListView, RefreshControl } from 'react-native';
import firebase from 'firebase';

import ItemView from './ItemView';

const config = {
  apiKey: 'AIzaSyDRHkRtloZVfu-2CXADbyJ_QG3ECRtZacY',
  authDomain: 'selbi-react-prototype.firebaseapp.com',
  databaseURL: 'https://selbi-react-prototype.firebaseio.com',
  storageBucket: 'selbi-react-prototype.appspot.com',
};
firebase.initializeApp(config);

export default class ListingsView extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds,
      refreshing: false,
    };
    this.fetchData.bind(this);

    this.fetchData()
      .catch((error) => {
        console.log(error);
      });

    firebase
      .database()
      .ref('listings')
      .on('value', (snapshot) => {
        if (snapshot.exists()) {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(snapshot.val()),
          });
          console.log(snapshot.val());
        }
      });
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  }

  fetchData() {
    return firebase
      .auth()
      .signInAnonymously()
      .then(() => firebase
        .database()
        .ref('listings')
        .once('value'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(snapshot.val()),
          });
          console.log(snapshot.val());
        }
      });
  }

  render() {
    return (
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
        dataSource={this.state.dataSource}
        renderRow={(data) => <ItemView {...data} />}
      />
    );
  }
}