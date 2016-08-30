import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';

// noinspection Eslint - Dimensions provided by react-native env.
import Dimensions from 'Dimensions';

export default class ItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageBase64: undefined,
    };

    const listingData = props.listing.val();
    const image = listingData.images.image1;
    props.loadImage(image.imageId)
      .then((imageSnapshot) => {
        this.setState({
          imageBase64: imageSnapshot.val().base64,
        });
      });
  }

  getImageView(fitHeight, price) {
    if (this.state.imageBase64) {
      return (
        <Image
          source={{ uri: `data:image/png;base64,${this.state.imageBase64}` }}
          style={{ height: fitHeight, borderRadius: 3 }}
        >
          <Text
            style={{
              margin: 5,
              color: 'white',
              fontWeight: 'bold',
              backgroundColor: 'transparent',
            }}
          >
            {`$${price}`}
          </Text>
        </Image>
      );
    }
    return (
      <View
        style={{ height: fitHeight, borderRadius: 3, backgroundColor:'grey' }}
      />
    );
  }

  render() {
    const { width } = Dimensions.get('window');
    const itemMargin = 2;
    const columnWidth = (width / 2) - (itemMargin * 2);

    const listingData = this.props.listing.val();
    const image = listingData.images.image1;

    console.log(`Rendering listing : ${listingData.title} : ${this.props.listing.key} :`
      + ` imgLoaded=${this.state.imageBase64 != undefined}`);

    const widthRatio = image.width / columnWidth;
    const fitHeight = image.height / widthRatio;

    return (
      <View
        style={{
          width: columnWidth,
          height: fitHeight,
          margin: itemMargin,
        }}
      >
        {this.getImageView(fitHeight, listingData.price)}
      </View>
    );
  }
}

// <Image
//   source={{ uri: `data:image/png;base64,${this.state.imageBase64}` }}
//   style={{ height: fitHeight, borderRadius: 3 }}
// />

// ItemView.propTypes = {
//   title: React.PropTypes.string.isRequired,
//   price: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
//   img: React.PropTypes.shape({
//     url: React.PropTypes.string.isRequired,
//     width: React.PropTypes.number.isRequired,
//     height: React.PropTypes.number.isRequired,
//   }),
// };
