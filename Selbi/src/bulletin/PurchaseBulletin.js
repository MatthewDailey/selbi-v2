import React from 'react';

import { View } from 'react-native';

import BulletinActionButton from './BulletinActionButton';
import EmojiAlignedText from '../components/EmojiAlignedText';

import bulletinStyles from './bulletinStyles';

export default function PurchaseBulletin({ bulletin, gotIt }) {
  return (
    <View>
      <EmojiAlignedText emoji="🤑" style={bulletinStyles.bulletinText}>
        {`${bulletin.payload.buyerDisplayName} bought your listing`
          + ` '${bulletin.payload.listingTitle}' for`
          + ` $${parseFloat(bulletin.payload.priceCents / 100).toFixed(2)}`}
      </EmojiAlignedText>
      <BulletinActionButton
        text="Awesome! Got it"
        onPress={gotIt}
        isAction={false}
      />
    </View>
  );
}

PurchaseBulletin.propTypes = {
  bulletin: React.PropTypes.shape({
    status: React.PropTypes.oneOf(['read', 'unread']).isRequired,
    timestamp: React.PropTypes.number.isRequired,
    type: React.PropTypes.oneOf(['purchase']).isRequired,
    payload: React.PropTypes.shape({
      buyerDisplayName: React.PropTypes.string.isRequired,
      feeCents: React.PropTypes.number.isRequired,
      priceCents: React.PropTypes.number.isRequired,
      listingTitle: React.PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  gotIt: React.PropTypes.func.isRequired,
};
