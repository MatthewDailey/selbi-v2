import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

import styles from '../../styles';
import colors from '../../colors';

export default function ChatListItem({ chatData, openChatScene }) {
  return (
    <TouchableHighlight
      onPress={openChatScene}
      underlayColor={`${colors.dark}64`}
      style={{
        padding: 16,
        flex: 1,
        borderBottomWidth: 1,
        borderColor: colors.dark,
      }}
    >
      <View>
        <Text>{chatData.type}</Text>
        <Text style={styles.friendlyTextLeft}>{chatData.title}</Text>
      </View>
    </TouchableHighlight>
  );
}

ChatListItem.propTypes = {
  chatData: React.PropTypes.shape({
    title: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    buyerUid: React.PropTypes.string.isRequired,
    sellerUid: React.PropTypes.string.isRequired,
    listingId: React.PropTypes.string.isRequired,
  }).isRequired,
  openChatScene: React.PropTypes.func.isRequired,
};
