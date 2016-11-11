import React from 'react';
import { connect } from 'react-redux';
import { ListView } from 'react-native';

import NewFriendListItem from './NewFriendListItem';

function FriendsListComponent({ friends, following, header }) {
  const friendsDatas = Object.keys(friends).map((friendUid) => {
    return {
      uid: friendUid,
      publicData: friends[friendUid],
    };
  });

  console.log(friends);

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
