import React from 'react';

import { View } from 'react-native';

import BulletinActionButton from './BulletinActionButton';
import ExpandingText from '../components/ExpandingText';

import bulletinStyles from './bulletinStyles';

export default function NewFollowerBulletin({ bulletin, openDetails }) {
  const sellerDisplayName = bulletin.payload.sellerPublicData.displayName;

  return (
    <View>
      <ExpandingText style={bulletinStyles.bulletinText}>
        😘 {sellerDisplayName} posted a new listing.
      </ExpandingText>
      <BulletinActionButton text="Check it out" onPress={openDetails} />
    </View>
  );
}

NewFollowerBulletin.propTypes = {
  bulletin: React.PropTypes.shape({
    status: React.PropTypes.oneOf(['read', 'unread']).isRequired,
    timestamp: React.PropTypes.number.isRequired,
    type: React.PropTypes.oneOf(['friend-posted-new-listing']).isRequired,
    payload: React.PropTypes.shape({
      sellerPublicData: React.PropTypes.object.isRequired,
      sellerUid: React.PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  openDetails: React.PropTypes.func.isRequired,
};
