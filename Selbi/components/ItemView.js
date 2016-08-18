import React from 'react';
import { Text, View, Image } from 'react-native';

// noinspection Eslint - Dimensions provided by react-native env.
import Dimensions from 'Dimensions';

export default function ItemView({ img, title, price }) {
  const { width } = Dimensions.get('window');
  const widthRatio = img.width / width;
  const fitheight = img.height / widthRatio;
  return (
    <View>
      <Image
        source={{ uri: img.url }}
        style={{ height: fitheight }}
      >
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
            backgroundColor: 'transparent',
          }}
        >
          {title} - ${price}
        </Text>
      </Image>
    </View>
  );
}

ItemView.propTypes = {
  title: React.PropTypes.string.isRequired,
  price: React.PropTypes.number.isRequired,
  img: React.PropTypes.shape({
    url: React.PropTypes.string.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  }),
};
