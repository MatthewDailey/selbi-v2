import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class EmojiAlignedText extends Component {
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Text style={[this.props.style, { width: 50, textAlign: 'center' }]}>{this.props.emoji}</Text>
        <Text style={[this.props.style, { flex: 1, flexWrap: 'wrap' }]}>{this.props.children}</Text>
      </View>
    );
  }
}

EmojiAlignedText.propTypes = {
  style: React.PropTypes.any,
  children: React.PropTypes.node,
  emoji: React.PropTypes.string,
  initialIsOpen: React.PropTypes.bool,
};

EmojiAlignedText.defaultProps = {
  initialIsOpen: false,
};
