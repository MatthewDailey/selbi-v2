import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import FlatButton from './FlatButton';

import colors from '../../../colors';

export default function FacebookButton(props) {
  return (
    <FlatButton
      {...props}
    >
      <Text style={{ color: colors.white }}>
        <Icon name="facebook" size={16} /> {props.text}
      </Text>
    </FlatButton>
  );
}

FacebookButton.defaultProps = {
  underlayColor: colors.greyedOut,
  backgroundColor: '#3b5998',
  borderWidth: 0,
};
