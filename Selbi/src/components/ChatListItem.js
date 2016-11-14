import React from 'react';
import { Image, View, Text, TouchableHighlight } from 'react-native';

import styles from '../../styles';
import colors from '../../colors';

export default function ChatListItem(
  { thumbnailUrl, otherPersonDisplayName, chatTitle, openChatScene }) {
  return (
    <TouchableHighlight
      onPress={openChatScene}
      underlayColor={colors.buttonHighlight}
      style={{
        padding: 16,
        flex: 1,
        borderBottomWidth: 1,
        borderColor: colors.dark,
      }}
    >
      <View style={styles.row}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={{ width: 50, height: 50 }}
          resideMode="center"
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingLeft: 8,
          }}
        >
          <Text style={styles.friendlyTextLeft}>{chatTitle}</Text>
          <Text>{otherPersonDisplayName}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

ChatListItem.propTypes = {
  chatTitle: React.PropTypes.string.isRequired,
  openChatScene: React.PropTypes.func.isRequired,
  thumbnailUrl: React.PropTypes.string,
  otherPersonDisplayName: React.PropTypes.string.isRequired,
};
