import React, { Component } from 'react';
import { ListView } from 'react-native';
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
    };

    const updateListingsView = (listings) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(listings),
      });
    };

    firebase
      .auth()
      .signInAnonymously()
      .then(() => firebase
        .database()
        .ref('listings')
        .once('value'))
      .then((snapshot) => {
        updateListingsView(snapshot.val())
        console.log(snapshot.val());
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <ListView
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