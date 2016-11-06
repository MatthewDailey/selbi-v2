import React from 'react';
import { connect } from 'react-redux';

import { View } from 'react-native';

import BulletinActionButton from './BulletinActionButton';
import EmojiAlignedText from '../components/EmojiAlignedText';

import { setListingKey } from '../reducers/ListingDetailReducer';

import bulletinStyles from './bulletinStyles';

function NewFollowerBulletin({ bulletin, openDetails, setDetailSceneListingKey }) {
  const sellerDisplayName = bulletin.payload.sellerPublicData.displayName;

  return (
    <View>
      <EmojiAlignedText style={bulletinStyles.bulletinText}>
        🎁 {sellerDisplayName} posted a new listing!
      </EmojiAlignedText>
      <BulletinActionButton
        text="Check it out"
        onPress={() => {
          setDetailSceneListingKey(bulletin.payload.listingId);
          openDetails();
        }}
      />
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
      sellerId: React.PropTypes.string.isRequired,
      listingId: React.PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  openDetails: React.PropTypes.func.isRequired,
  setDetailSceneListingKey: React.PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDetailSceneListingKey: (listingKey) => dispatch(setListingKey(listingKey)),
  };
};

export default connect(
  undefined,
  mapDispatchToProps
)(NewFollowerBulletin);
