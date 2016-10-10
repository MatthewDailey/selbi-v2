import React from 'react';
import { View, Text } from 'react-native';

import RoutableScene from '../../nav/RoutableScene';

import styles from '../../../styles';

export default class BankIntroScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <View style={styles.paddedContainer}>
        <Text style={styles.friendlyTextLeft}>
          Accepting payment through Selbi is a great way to encourage buyers.
        </Text>
        <View style={styles.halfPadded} />
        <Text style={styles.friendlyTextLeft}>
          We use Stripe Connect to direct deposit your profit to your bank account.
        </Text>
        <View style={styles.halfPadded} />
        <Text style={styles.friendlyTextLeft}>
          To do this, we need a couple pieces of information.
        </Text>
      </View>
    )
  }
}