import React, { Component } from 'react';
import { View, Text } from 'react-native';

import RoutableScene from '../nav/RoutableScene';
import styles from '../../styles';

export default class ListingsScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <View style={styles.container}><Text>Hello ListingScene</Text></View>
    );
  }
}
