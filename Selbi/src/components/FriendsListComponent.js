import React from 'react';
import { connect } from 'react-redux';
import { ListView } from 'react-native';

import NewFriendListItem from './NewFriendListItem';

function FriendsListComponent({ friends, followers, header }) {
  const friendsDatas = Object.keys(friends).map((friendUid) => {
    return {
      uid: friendUid,
      publicData: friends[friendUid],
    };
  });

  return (
    <ListView
      enableEmptySections
      removeClippedSubviews={false}
      dataSource={new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        .cloneWithRows(friendsDatas)}
      renderRow={(data) =>
        <NewFriendListItem isFollower={!!followers[data.uid]} friendData={data} />}
      renderHeader={() => header}
    />
  );
}

FriendsListComponent.propTypes = {
  friends: React.PropTypes.object.isRequired,
  followers: React.PropTypes.object.isRequired,
  header: React.PropTypes.element,
};

function mapStateToProps(state) {
  return {
    followers: state.friends.followers,
  };
}

export default connect(
  mapStateToProps,
  undefined
)(FriendsListComponent);
