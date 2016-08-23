import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from '../../styles';

export default function LoginOrRegisterScene() {
  return (
    <View style={styles.fullScreenContainer}>
      <Text style={styles.textLabel}>Email</Text>
      <TextInput
        style={styles.textInput}
      />
      <Text style={styles.textLabel}>Password</Text>
      <TextInput
        secureTextEntry
        style={styles.textInput}
      />

    </View>
  );
}
//
// LoginOrRegisterScene.propTypes = {
//   // TODO
// };
