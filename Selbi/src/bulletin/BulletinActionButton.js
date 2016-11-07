import React from 'react';
import { View, Text } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import VisibilityWrapper from '../components/VisibilityWrapper';
import EmojiAlignedText from '../components/EmojiAlignedText';

import bulletinStyles from './bulletinStyles';

const IgnoreButton = MKButton.flatButton()
  .withStyle({
    borderRadius: 2,
    flex: 1,
  })
  .build();

const FlatButton = MKButton.flatButton()
  .withStyle({
    borderRadius: 4,
    flex: 1,
    borderWidth: 1,
  })
  .withTextStyle({
    textAlign: 'left',
  })
  .build();

export default function BulletinActionButton({ text, onPress, onDismiss, emoji }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flex: 1 }}>
        <FlatButton onPress={onPress}>
          <EmojiAlignedText emoji={`${emoji}`} style={bulletinStyles.actionBulletinText}>
            {text}
          </EmojiAlignedText>
        </FlatButton>
      </View>
      <VisibilityWrapper isVisible={!!onDismiss} style={{ marginLeft: 4 }}>
        <IgnoreButton onPress={onDismiss}>
          <Text style={bulletinStyles.dismissButtonText}>
            <Icon name="times" />
          </Text>
        </IgnoreButton>
      </VisibilityWrapper>
    </View>
  );
}

BulletinActionButton.propTypes = {
  emoji: React.PropTypes.string,
  text: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func,
  onDismiss: React.PropTypes.func,
  isAction: React.PropTypes.bool,
};

BulletinActionButton.defaultProps = {
  isAction: true,
};
