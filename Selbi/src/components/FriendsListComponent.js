import React from 'react';
import { connect } from 'react-redux';
import { ListView, View, Text } from 'react-native';

import NewFriendListItem from './NewFriendListItem';

import styles from '../../styles';

function FriendsListComponent({ friends, following, header, emptyMessage }) {
  const friendsDatas = Object.keys(friends).map((friendUid) => {
    return {
      uid: friendUid,
      publicData: friends[friendUid],
    };
  });

  if (Object.keys(friends).length === 0) {
    return (
      <View style>
        {header}
        <View style={styles.paddedCenterContainer}>
          <Text style={styles.friendlyText}>{emptyMessage}</Text>
        </View>
      </View>
    );
  }

  return (
    <ListView
      enableEmptySections
      removeClippedSubviews={false}
      dataSource={new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        .cloneWithRows(friendsDatas)}
      renderRow={(data) =>
        <NewFriendListItem isFollowing={!!following[data.uid]} friendData={data} />}
      renderHeader={() => header}
    />
  );
}

FriendsListComponent.propTypes = {
  friends: React.PropTypes.object.isRequired,
  following: React.PropTypes.object.isRequired,
  header: React.PropTypes.element,
};

function mapStateToProps(state) {
  return {
    following: state.friends.following,
  };
}

export default connect(
  mapStateToProps,
  undefined
)(FriendsListComponent);
