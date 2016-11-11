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
            friends={this.props.following}
            openSellerProfile={() => this.goNext('sellerProfile')}
            header={
              <View style={styles.padded}>
                <FlatButton onPress={() => this.goNext('addFriend')}>
                  <Text>Follow by Username</Text>
                </FlatButton>
                <View style={styles.halfPadded} />
                <FlatButton onPress={() => this.goNext('syncContacts')}>
                  <Text>Follow from Contacts</Text>
                </FlatButton>
              </View>
            }
            emptyMessage="You aren't following anyone."
          />
        </View>
        <View tabLabel="Followers" style={styles.container}>
          <FriendsListComponent
            friends={this.props.followers}
            openSellerProfile={() => this.goNext('sellerProfile')}
            emptyMessage="You have no followers."
          />
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
