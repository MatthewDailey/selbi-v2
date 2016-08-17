import React, { Component } from 'react';
import ReactNative from 'react-native';

import styles from '../styles.js';

const { Text, View, Image } = ReactNative;

class ItemView extends Component {
  render() {
    console.log(this.props);
    return (
      <View>
        <Image
          source={{ uri: this.props.img.url }}
          style={{ width: this.props.img.width, height: this.props.img.height }}
        >
          <Text>{this.props.title} - ${this.props.price}</Text>
        </Image>
      </View>
    );
  }
}

module.exports = ItemView;
