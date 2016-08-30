import React from 'react';
import { View, Text, TouchableHighlight, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../../styles';
import colors from '../../colors';

function notImplemented() {
  Alert.alert('Not yet supported.');
}

export default function Menu() {
  return (
    <View style={styles.padded}>
      <View style={styles.paddedCenterContainerWhite}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Matt Dailey</Text>
        <View style={styles.halfPadded} />
        <TouchableHighlight onPress={notImplemented}>
          <Text style={{ fontSize: 10 }}>Sign out</Text>
        </TouchableHighlight>
      </View>

      <View
        style={{
          margin: 8,
          borderBottomWidth: 1,
          borderBottomColor: `${colors.dark}64`,
        }}
      />

      <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
        <Text style={styles.menuText}><Icon name="map-marker" size={20} />  Local Listings</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
        <Text style={styles.menuText}><Icon name="users" size={20} /> Friend's Listings</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
        <Text style={styles.menuText}><Icon name="heart-o" size={20} /> Favorites</Text>
      </TouchableHighlight>

      <View
        style={{
          margin: 8,
          borderBottomWidth: 1,
          borderBottomColor: `${colors.dark}64`,
        }}
      />

      <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
        <Text style={styles.menuText}><Icon name="gift" size={20} /> My Listings</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
        <Text style={styles.menuText}><Icon name="commenting-o" size={20} /> Chats</Text>
      </TouchableHighlight>

      <View
        style={{
          margin: 8,
          borderBottomWidth: 1,
          borderBottomColor: `${colors.dark}64`,
        }}
      />

      <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
        <Text style={styles.menuText}><Icon name="user" size={20} /> My Profile</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={notImplemented} underlayColor={colors.secondary}>
        <Text style={styles.menuText}><Icon name="gear" size={20} /> Settings</Text>
      </TouchableHighlight>
    </View>
  );
}
