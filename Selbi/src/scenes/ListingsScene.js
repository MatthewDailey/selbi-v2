import React, { Component } from 'react';
import { ListView, RefreshControl, View, Text } from 'react-native';
import styles from '../../styles';

export default class ListingsScene extends Component {
  render() {
    return (
      <View style={styles.container}><Text>Hello ListingScene</Text></View>
    );
  }
}