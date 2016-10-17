import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

import styles from '../../styles';
import colors from '../../colors';

export default function ChatListItem({ chatTitle, openChatScene }) {
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
        <Text style={styles.friendlyTextLeft}>{chatTitle}</Text>
      </View>
    </TouchableHighlight>
  );
}

ChatListItem.propTypes = {
  chatTitle: React.PropTypes.string.isRequired,
  openChatScene: React.PropTypes.func.isRequired,
};
