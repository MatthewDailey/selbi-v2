import React from 'react';
import { View, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MKButton } from 'react-native-material-kit';

import colors from '../../../colors';

const buttonStyle = { fontSize: 20, fontWeight: 'bold' };
const buttonMargin = 8;

const Button = MKButton.button()
  .withStyle({
    borderRadius: 5,
    padding: 15,
  })
  .withBackgroundColor(colors.primary)
  .build();

export function UpdateButton({ openEdit }) {
  return (
    <Button onPress={openEdit}>
      <Text>Update Listing</Text>
    </Button>
  );
}
UpdateButton.propTypes = {
  openEdit: React.PropTypes.func.isRequired,
};

const LeftButton = MKButton.button()
  .withStyle({
    flex: 1,
    marginLeft: buttonMargin,
    marginRight: buttonMargin / 2,
    marginBottom: buttonMargin,
  })
  .withBackgroundColor(colors.primary)
  .withOnPress(() => Alert.alert('Sorry, not yet supported.'))
  .build();

const RightButton = MKButton.button()
  .withStyle({
    flex: 1,
    marginLeft: buttonMargin / 2,
    marginRight: buttonMargin,
    marginBottom: buttonMargin,
  })
  .withBackgroundColor(colors.primary)
  .withOnPress(() => Alert.alert('Sorry, not yet supported.'))
  .build();

export function ChatButton({ isVisible, openChat }) {
  if (isVisible) {
    return (
      <LeftButton onPress={openChat}>
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
  openChat: React.PropTypes.func.isRequired,
};

export function BuyButton({ price }) {
  return (
    <RightButton>
      <Text style={buttonStyle}>
        <Icon name="usd" size={buttonStyle.fontSize} /> {price}
      </Text>
    </RightButton>
  );
}
BuyButton.propTypes = {
  price: React.PropTypes.number.isRequired,
};

export default undefined;
