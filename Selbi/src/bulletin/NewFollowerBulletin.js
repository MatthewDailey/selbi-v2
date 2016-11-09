import React from 'react';

import { View } from 'react-native';

import BulletinActionButton from './BulletinActionButton';
import EmojiAlignedText from '../components/EmojiAlignedText';
import VisibilityWrapper from '../components/VisibilityWrapper';

import bulletinStyles from './bulletinStyles';

export default function NewFollowerBulletin({ newFollowerBulletin, onPress, gotIt }) {
  console.log(newFollowerBulletin)
  const newFollowerDisplayName = newFollowerBulletin.payload.newFollowerPublicData.displayName;

  return (
    <BulletinActionButton
      emoji="😘"
      text={`${newFollowerDisplayName} is now following you.`}
      onPress={onPress}
      onDismiss={gotIt}
    />
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
  onPress: React.PropTypes.func.isRequired,
  gotIt: React.PropTypes.func.isRequired,
};
