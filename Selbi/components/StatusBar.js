import React from 'react';
import { Text, View } from 'react-native';

import styles from '../styles';

function StatusBar({ title }) {
  return (
    <View>
      <View style={styles.statusbar} />
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>{title}</Text>
      </View>
    </View>
  );
}

StatusBar.propTypes = {
  title: React.PropTypes.string.isRequired,
};

module.exports = StatusBar;
