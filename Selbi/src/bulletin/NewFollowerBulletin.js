import React from 'react';

import { View, Text } from 'react-native';

import BulletinActionButton from './BulletinActionButton';

import bulletinStyles from './bulletinStyles';

export default function NewFollowerBulletin({ newFollowerBulletin, followUser }) {
  const newFollowerDisplayName = newFollowerBulletin.payload.newFollowerPublicData.displayName;
  const newFollowerUsername = newFollowerBulletin.payload.newFollowerPublicData.username;

  return (
    <View>
      <Text ellipsizeMode="tail" numberOfLines={1} style={bulletinStyles.bulletinText}>
        😘 {newFollowerDisplayName} (@{newFollowerUsername}) is now following you.
      </Text>
      <BulletinActionButton
        text={`Follow ${newFollowerDisplayName}`}
        onPress={() => followUser(newFollowerBulletin.payload.newFollowerUid)}
      />
    </View>
  );
}

NewFollowerBulletin.propTypes = {
  newFollowerBulletin: React.PropTypes.shape({
    status: React.PropTypes.oneOf(['read', 'unread']).isRequired,
    timestamp: React.PropTypes.number.isRequired,
    type: React.PropTypes.oneOf(['follow']).isRequired,
    payload: React.PropTypes.shape({
      newFollowerPublicData: React.PropTypes.object.isRequired,
      newFollowerUid: React.PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  followUser: React.PropTypes.func.isRequired,
}
