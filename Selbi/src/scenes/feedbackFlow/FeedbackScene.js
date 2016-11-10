import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import RoutableScene from '../../nav/RoutableScene';

import styles from '../../../styles';

export default class FeedbackScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <View style={styles.padded}>
        <Text style={{ fontWeight: 'bold' }}>Your Email</Text>
        <TextInput
          placeholder="Email"
          style={[styles.friendlyTextLeft, { height: 40 }]}
        />
        <Text style={{ fontWeight: 'bold' }}>Message</Text>
        <AutoGrowingTextInput
          placeholder="Message"
          style={styles.friendlyTextLeft}
        />
      </View>
    );
  }
}

