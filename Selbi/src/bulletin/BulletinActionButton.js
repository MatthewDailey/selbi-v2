import React from 'react';
import { View, Text } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import VisibilityWrapper from '../components/VisibilityWrapper';

import bulletinStyles, { notificationDescriptionFontSize } from './bulletinStyles';
import colors from '../../colors';

const IgnoreButton = MKButton.flatButton()
  .withStyle({
    borderRadius: 2,
    flex: 1,
  })
  .build();

const FlatButton = MKButton.flatButton()
  .withStyle({
    borderRadius: 2,
    flex: 1,
    borderWidth: 1,
  })
  .build();

export default function BulletinActionButton({ text, onPress, onDismiss, emoji }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <VisibilityWrapper isVisible={!!onDismiss} style={{ flex: 1, margin: 4 }}>
        <IgnoreButton onPress={onDismiss}>
          <Text style={bulletinStyles.actionButtonText}>
            Dismiss
          </Text>
        </IgnoreButton>
      </VisibilityWrapper>
      <View style={{ flex: 1, margin: 4 }}>
        <FlatButton onPress={onPress}>
          <Text style={bulletinStyles.actionButtonText}>
            {emoji} {text}
          </Text>
        </FlatButton>
      </View>
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
