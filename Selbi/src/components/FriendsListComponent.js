import React from 'react';
import { ListView } from 'react-native';

import NewFriendListItem from './NewFriendListItem';

export default function FriendsListComponent({ areFollowers, friends }) {
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
      renderRow={(data) => <NewFriendListItem isFollower={areFollowers} friendData={data} />}
    />
  );
}

FriendsListComponent.propTypes = {
  areFollowers: React.PropTypes.bool.isRequired,
  friends: React.PropTypes.object.isRequired,
};
