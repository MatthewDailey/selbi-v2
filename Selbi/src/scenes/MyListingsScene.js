import React from 'react';
import { View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { loadListingsByStatus } from '../firebase/FirebaseConnector';
import RoutableScene from '../nav/RoutableScene';
import { ListingsComponent } from './ListingsScene';

import styles from '../../styles';
import colors from '../../colors';

export default class MyListingsScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <ScrollableTabView
        tabBarBackgroundColor={colors.primary}
        tabBarUnderlineColor={colors.secondary}
        tabBarActiveTextColor={colors.secondary}
        style={styles.fullScreenContainer}
      >
        <View tabLabel="Inactive" style={styles.fullScreenContainer}>
          <ListingsComponent fetchData={() => loadListingsByStatus('inactive')} />
        </View>
        <View tabLabel="Public" style={styles.fullScreenContainer}>
          <ListingsComponent fetchData={() => loadListingsByStatus('public')} />
        </View>
        <View tabLabel="Private" style={styles.fullScreenContainer}>
          <ListingsComponent fetchData={() => loadListingsByStatus('private')} />
        </View>
        <View tabLabel="Sold" style={styles.fullScreenContainer}>
          <ListingsComponent fetchData={() => loadListingsByStatus('sold')} />
        </View>

      </ScrollableTabView>
    );
  }
}