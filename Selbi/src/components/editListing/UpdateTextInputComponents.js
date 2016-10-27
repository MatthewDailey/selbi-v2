import React from 'react';
import { View, Text } from 'react-native';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import { isStringFloat } from '../../utils';
import styles from '../../../styles';

export default undefined;

export function UpdateTitleComponent({ title, setTitle }) {
  return (
    <View>
      <Text style={{ fontWeight: 'bold' }}>Title</Text>
      <AutoGrowingTextInput
        style={styles.friendlyTextLeft}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
    </View>
  );
}
UpdateTitleComponent.propTypes = {
  title: React.PropTypes.string,
  setTitle: React.PropTypes.func.isRequired,
};

export function UpdatePriceComponent({ price, setPrice }) {
  return (
    <View>
      <Text style={{ fontWeight: 'bold' }}>Price (USD)</Text>
      <AutoGrowingTextInput
        style={styles.friendlyTextLeft}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={(newText) => {
          if (isStringFloat(newText)) {
            setPrice(newText);
          }
        }}
      />
    </View>
  );
}
UpdatePriceComponent.propTypes = {
  price: React.PropTypes.string,
  setPrice: React.PropTypes.func.isRequired,
};

export function UpdateDescriptionComponent({ description, setDescription }) {
  return (
    <View>
      <Text style={{ fontWeight: 'bold' }}>Description</Text>
      <AutoGrowingTextInput
        style={styles.friendlyTextLeft}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
    </View>
  );
}
UpdateDescriptionComponent.propTypes = {
  description: React.PropTypes.string,
  setDescription: React.PropTypes.func.isRequired,
};
