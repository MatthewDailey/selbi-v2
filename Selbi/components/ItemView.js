import React from 'react';
import { Text, View, Image } from 'react-native';

// noinspection Eslint - Dimensions provided by react-native env.
import Dimensions from 'Dimensions';

export default function ItemView({ img, title, price }) {
  const { width } = Dimensions.get('window');
  const columnWidth = width / 2;
  const widthRatio = img.width / columnWidth;
  const fitHeight = img.height / widthRatio;
  return (
    <View style={{ width: columnWidth, height: fitHeight }}>
      <Image
        source={{ uri: img.url }}
        style={{ height: fitHeight }}
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
