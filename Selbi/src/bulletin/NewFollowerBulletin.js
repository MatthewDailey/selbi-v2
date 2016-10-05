import React from 'react';

import { View } from 'react-native';

import BulletinActionButton from './BulletinActionButton';
import ExpandingText from '../components/ExpandingText';
import VisibilityWrapper from '../components/VisibilityWrapper';

import bulletinStyles from './bulletinStyles';

export default function NewFollowerBulletin({ newFollowerBulletin, followUser }) {
  const newFollowerDisplayName = newFollowerBulletin.payload.newFollowerPublicData.displayName;
  const newFollowerUsername = newFollowerBulletin.payload.newFollowerPublicData.username;

  return (
    <View>
      <ExpandingText style={bulletinStyles.bulletinText}>
        😘 {newFollowerDisplayName} (@{newFollowerUsername}) is now following you.
      </ExpandingText>
      <VisibilityWrapper isVisible={!newFollowerBulletin.payload.reciprocated}>
        <BulletinActionButton
          text={`Follow ${newFollowerDisplayName}`}
          onPress={() => followUser(newFollowerBulletin.payload.newFollowerUid)}
        />
      </VisibilityWrapper>
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
};
