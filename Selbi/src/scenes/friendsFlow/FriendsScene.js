import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import RoutableScene from '../../nav/RoutableScene';

import FriendsListComponent from '../../components/FriendsListComponent';

import styles from '../../../styles';
import colors from '../../../colors';

class FriendsScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <ScrollableTabView
        tabBarBackgroundColor={colors.primary}
        tabBarUnderlineColor={colors.secondary}
        tabBarActiveTextColor={colors.secondary}
        style={styles.fullScreenContainer}
      >
        <View tabLabel="Following" style={styles.container}>
          <FriendsListComponent areFollowers={false} friends={this.props.followers} />
        </View>
        <View tabLabel="Followers" style={styles.container}>
          <FriendsListComponent areFollowers friends={this.props.followers} />
        </View>
      </ScrollableTabView>
    );
  }
}

function mapStateToProps(state) {
  return {
    following: state.friends.following,
    followers: state.friends.followers,
  };
}

export default connect(
  mapStateToProps,
  undefined
)(FriendsScene);
