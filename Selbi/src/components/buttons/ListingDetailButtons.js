import React from 'react';
import { View, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MKButton } from 'react-native-material-kit';

import colors from '../../../colors';
import { paddingSize } from '../../../styles';
import { isPaymentsEnabled } from '../../../features';

const buttonStyle = { fontSize: 20 };
const buttonMargin = paddingSize / 2;

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
    marginRight: buttonMargin / 2,
  })
  .withBackgroundColor(colors.primary)
  .build();

const RightButton = MKButton.button()
  .withStyle({
    flex: 1,
    marginLeft: buttonMargin / 2,
  })
  .withBackgroundColor(colors.primary)
  .build();

const DisabledButton = MKButton.flatButton()
  .withStyle({
    flex: 1,
    marginLeft: buttonMargin / 2,
  })
  .build();

export function ChatButton({ isVisible, onPress = unsupported }) {
  if (isVisible) {
    return (
      <LeftButton onPress={onPress}>
        <Text style={buttonStyle}>
          <Icon name="commenting-o" size={buttonStyle.fontSize} />
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

export function BuyButton({ price, onPress = unsupported, isSold }) {
  if (isSold) {
    return (
      <DisabledButton>
        <Text style={buttonStyle}>
          SOLD - ${price}
        </Text>
      </DisabledButton>
    );
  }
  return (
    <RightButton
      onPress={() => {
        if (isPaymentsEnabled) {
          onPress();
        } else {
          Alert.alert('Pay with Selbi is not currently enabled.');
        }
      }}
    >
      <Text style={buttonStyle}>
        ${price}
      </Text>
    </RightButton>
  );
}
BuyButton.propTypes = {
  price: React.PropTypes.number.isRequired,
  onPress: React.PropTypes.func,
  isSold: React.PropTypes.bool,
};

export default undefined;
