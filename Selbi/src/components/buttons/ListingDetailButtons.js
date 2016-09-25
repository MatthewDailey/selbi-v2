import React from 'react';
import { View, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MKButton } from 'react-native-material-kit';

import colors from '../../../colors';

const buttonStyle = { fontSize: 20 };
const buttonMargin = 8;

const Button = MKButton.button()
  .withStyle({
    borderRadius: 5,
    padding: 15,
  })
  .withBackgroundColor(colors.primary)
  .build();

export function UpdateButton({ onPress }) {
  return (
    <Button onPress={onPress}>
      <Text style={buttonStyle}>Update Listing</Text>
    </Button>
  );
}
UpdateButton.propTypes = {
  onPress: React.PropTypes.func.isRequired,
};

const unsupported = () => Alert.alert('Sorry, not yet supported.');

const LeftButton = MKButton.button()
  .withStyle({
    flex: 1,
    marginLeft: buttonMargin,
    marginRight: buttonMargin / 2,
    marginBottom: buttonMargin,
  })
  .withBackgroundColor(colors.primary)
  .build();

const RightButton = MKButton.button()
  .withStyle({
    flex: 1,
    marginLeft: buttonMargin / 2,
    marginRight: buttonMargin,
    marginBottom: buttonMargin,
  })
  .withBackgroundColor(colors.primary)
  .build();

export function ChatButton({ isVisible, onPress = unsupported }) {
  if (isVisible) {
    return (
      <LeftButton onPress={onPress}>
        <Text style={buttonStyle}>
          <Icon name="commenting-o" size={buttonStyle.fontSize}/>
        </Text>
      </LeftButton>
    );
  }
  return <View />;
}
ChatButton.propTypes = {
  isVisible: React.PropTypes.bool.isRequired,
  onPress: React.PropTypes.func,
};

export function BuyButton({ price, onPress = unsupported }) {
  return (
    <RightButton onPress={onPress}>
      <Text style={buttonStyle}>
        ${price}
      </Text>
    </RightButton>
  );
}
BuyButton.propTypes = {
  price: React.PropTypes.number.isRequired,
  onPress: React.PropTypes.func,
};

export default undefined;
