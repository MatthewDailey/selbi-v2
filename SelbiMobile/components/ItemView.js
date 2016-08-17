import React, { Component } from 'react';
import ReactNative from 'react-native';

const Dimensions = require('Dimensions');

const { Text, View, Image } = ReactNative;

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
              backgroundColor: 'transparent'
            }}
          >
            {this.props.title} - ${this.props.price}
          </Text>
        </Image>
      </View>
    );
  }
}

module.exports = ItemView;
