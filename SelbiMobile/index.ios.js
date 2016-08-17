/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  ListView,
} from 'react-native';
import StatusBar from './components/StatusBar';
import ItemView from './components/ItemView';
import styles from './styles.js';


class ListMobile extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const longArray = []
    for(let i = 0; i < 10; i++) {
      longArray.push(i);
    }
    this.state = {
      dataSource: ds.cloneWithRows(longArray),
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar title="Selbi" />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={() =>
            <ItemView
              title="Simple Title"
              price="5.50"
              img={{
                url: 'https://firebasestorage.googleapis.com/v0/b/selbi-react-prototype.appspot.com/o/my_face.jpg?alt=media&token=07e8f1ea-caed-4b6a-b022-5b042020bf24',
                width: 100,
                height: 100,
              }}
            />}
        />
      </View>
    );
  }
}

AppRegistry.registerComponent('SelbiMobile', () => ListMobile);
