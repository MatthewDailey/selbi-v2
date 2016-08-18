import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  ListView,
  Image,
} from 'react-native';
import firebase from 'firebase';

import styles from './styles.js';

const Dimensions = require('Dimensions');


class ItemView extends Component {
  render() {
    const { height, width } = Dimensions.get('window');
    console.log(width)
    const widthRatio = this.props.img.width / width;
    console.log(widthRatio)
    const fitheight = this.props.img.height / widthRatio;
    console.log(fitheight)
    return (
      <View>
        <Image
          source={{ uri: this.props.img.url }}
          style={{ height: fitheight }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              backgroundColor: 'transparent',
            }}
          >
            {this.props.title} - ${this.props.price}
          </Text>
        </Image>
      </View>
    );
  }
}

class StatusBar extends Component {
  render() {
    return (
      <View>
        <View style={styles.statusbar} />
        <View style={styles.navbar}>
          <Text style={styles.navbarTitle}>{this.props.title}</Text>
        </View>
      </View>
    );
  }
}

const config = {
  apiKey: 'AIzaSyDRHkRtloZVfu-2CXADbyJ_QG3ECRtZacY',
  authDomain: 'selbi-react-prototype.firebaseapp.com',
  databaseURL: 'https://selbi-react-prototype.firebaseio.com',
  storageBucket: 'selbi-react-prototype.appspot.com',
};
firebase.initializeApp(config);

class ListMobile extends Component {
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
      <View style={styles.container}>
        <StatusBar title="Selbi" />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(data) =>
            <ItemView {...data} />}
        />
      </View>
    );
  }
}

AppRegistry.registerComponent('Selbi', () => ListMobile);
