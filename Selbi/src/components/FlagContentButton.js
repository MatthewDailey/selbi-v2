import React from 'react';
import { View, Text, TouchableHighlight, Alert, ActionSheetIOS } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';

import { flagListingAsInappropriate } from '../firebase/FirebaseConnector';

import { getListingShareUrl } from '../deeplinking/Utilities';

import colors from '../../colors';
import { reportButtonPress, reportEvent } from '../SelbiAnalytics';

const BUTTONS = [
  'Share',
  'Message',
  'Buy',
  'Report Content',
  'Cancel',
];
const DESTRUCTIVE_INDEX = 3;
const CANCEL_INDEX = 4;

export default function FlagContentButton({ listingId, openChat, openBuy, isSeller }) {
  if (isSeller) {
    return <View />;
  }

  const reportContent = () => {
    reportButtonPress('flag_content');
    Alert.alert('Inappropriate Content?',
      'Do you want to flag this listing as inappropriate content?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Flag',
          onPress: () => {
            reportEvent('flagged_content');
            flagListingAsInappropriate(listingId, getListingShareUrl(listingId))
             .catch(console.log);
            Alert.alert('😭 Sorry you had to see that!', 'Thanks for being an awesome member'
              + ' of the Selbi community!');
          },
        },
      ]);
  };

  const shareListing = () => {
    reportButtonPress('action_sheet_share');
    Share.open({ url: getListingShareUrl(listingId) })
      .then(console.log)
      .catch(console.log);
  };

  return (
    <TouchableHighlight
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        alignItems: 'center',
        paddingTop: 32,
        paddingRight: 8,
        height: 64,
        width: 48,
        opacity: 0.7,
      }}
      onPress={() => {
        ActionSheetIOS.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          destructiveButtonIndex: DESTRUCTIVE_INDEX,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              shareListing();
              break;
            case 1:
              reportButtonPress('action_sheet_chat');
              openChat();
              break;
            case 2:
              reportButtonPress('action_sheet_buy');
              openBuy();
              break;
            case DESTRUCTIVE_INDEX:
              reportContent();
              break;
            default:
              // Do nothing.
          }
        });
      }}
      underlayColor={colors.transparent}
      activeOpacity={0.5}
    >
      <Text
        style={{
          textShadowColor: colors.dark,
          textShadowOffset: {
            width: 1,
            height: 1,
          },
          textShadowRadius: 2,
        }}
      >
        <Icon name="ellipsis-v" size={18} color={colors.secondary} />
      </Text>
    </TouchableHighlight>
  );
}
FlagContentButton.propTypes = {
  listingId: React.PropTypes.string.isRequired,
};

