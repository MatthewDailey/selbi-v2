import React from 'react';
import { connect } from 'react-redux';

import { View } from 'react-native';

import BulletinActionButton from './BulletinActionButton';
import ExpandingText from '../components/ExpandingText';

import { setListingKey, setBuyerUid } from '../reducers/ListingDetailReducer';

import bulletinStyles from './bulletinStyles';

function NewMessagesBulletin({
    bulletin,
    takeAction,
    setDetailSceneListingKey,
    setDetailSceneBuyerUid }) {
  const messageOrMessages = bulletin.payload.count > 1 ? 'messages' : 'message';

  return (
    <View>
      <ExpandingText style={bulletinStyles.bulletinText}>
        💌 {bulletin.payload.senderDisplayName} sent you {bulletin.payload.count} new {messageOrMessages} about {bulletin.payload.listingTitle}
      </ExpandingText>
      <BulletinActionButton
        text="Read new messages"
        onPress={() => {
          setDetailSceneListingKey(bulletin.payload.chat.listingId);
          setDetailSceneBuyerUid(bulletin.payload.chat.buyerUid);
          takeAction();
        }}
      />
    </View>
  );
}

NewMessagesBulletin.propTypes = {
  bulletin: React.PropTypes.shape({
    status: React.PropTypes.oneOf(['read', 'unread']).isRequired,
    timestamp: React.PropTypes.number.isRequired,
    type: React.PropTypes.oneOf(['new-message']).isRequired,
    payload: React.PropTypes.shape({
      count: React.PropTypes.number.isRequired,
      chat: React.PropTypes.shape({
        buyerUid: React.PropTypes.string.isRequired,
        listingId: React.PropTypes.string.isRequired,
      }).isRequired,
      listingTitle: React.PropTypes.string.isRequired,
      senderDisplayName: React.PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  takeAction: React.PropTypes.func.isRequired,
  setDetailSceneListingKey: React.PropTypes.func.isRequired,
  setDetailSceneBuyerUid: React.PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDetailSceneListingKey: (listingKey) => dispatch(setListingKey(listingKey)),
    setDetailSceneBuyerUid: (listingKey) => dispatch(setBuyerUid(listingKey)),
  };
};

export default connect(
  undefined,
  mapDispatchToProps
)(NewMessagesBulletin);