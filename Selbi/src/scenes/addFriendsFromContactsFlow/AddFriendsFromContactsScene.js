import React from 'react';
import { View, Text } from 'react-native';
import RoutableScene from '../../nav/RoutableScene';

export default class AddFriendsFromContactsScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <View>
        <Text>Add Friends</Text>
      </View>
    );
  }
}
