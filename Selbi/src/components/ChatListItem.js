import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

import styles from '../../styles';
import colors from '../../colors';

export default function ChatListItem({ chatType, chatTitle, openChatScene }) {
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
        <Text>{chatType}</Text>
        <Text style={styles.friendlyTextLeft}>{chatTitle}</Text>
      </View>
    </TouchableHighlight>
  );
}

ChatListItem.propTypes = {
  chatType: React.PropTypes.string.isRequired,
  chatTitle: React.PropTypes.string.isRequired,
  openChatScene: React.PropTypes.func.isRequired,
};
