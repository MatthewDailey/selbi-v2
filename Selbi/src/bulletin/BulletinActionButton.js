import React from 'react';
import { View, Text } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import bulletinStyles from './bulletinStyles';
import colors from '../../colors';

const FlatButton = MKButton.flatButton()
  .withStyle({
    borderRadius: 5,
  })
  .withBackgroundColor(colors.white)
  .build();

export default function BulletinActionButton({ text, onPress }) {
  return (
    <View style={{ alignItems: 'flex-end' }}>
      <FlatButton onPress={onPress}>
        <Text style={bulletinStyles.actionButtonText}>
          {text} <Icon name="arrow-right" />
        </Text>
      </FlatButton>
    </View>
  );
}

BulletinActionButton.propTypes = {
  text: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func,
};
