import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import RoutableScene from '../../nav/RoutableScene';

import FriendsListComponent from '../../components/FriendsListComponent';
import FlatButton from '../../components/buttons/FlatButton';

import styles from '../../../styles';
import colors from '../../../colors';

class FriendsScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <ScrollableTabView
        tabBarBackgroundColor={colors.secondary}
        tabBarUnderlineColor={colors.primary}
        tabBarActiveTextColor={colors.primary}
        style={styles.fullScreenContainer}
      >
        <View tabLabel="Following" style={styles.container}>
          <FriendsListComponent
            friends={this.props.followers}
            header={
              <View style={styles.paddedContainer}>
                <FlatButton onPress={() => this.goNext('addFriend')}>
                  <Text>Follow by Username</Text>
                </FlatButton>
              </View>
            }
          />
        </View>
        <View tabLabel="Followers" style={styles.container}>
          <FriendsListComponent friends={this.props.followers} />
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
