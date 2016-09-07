import React, { Component } from 'react';
import { Text, View, Image, TouchableHighlight } from 'react-native';
import { MKSpinner } from 'react-native-material-kit';

// noinspection Eslint - Dimensions provided by react-native env.
import Dimensions from 'Dimensions';

import ListingDetailScene from './ListingDetailScene';

import styles from '../../styles';
import colors from '../../colors';

export default class ItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageData: undefined,
    };
  }

  getImageView(fitHeight, price) {
    if (this.state.imageData) {
      const openDetailView = () => {
        this.props.openSimpleScene(
          <ListingDetailScene
            title={this.props.listing.val().title}
            leftIs="back"
            imageData={this.state.imageData.val()}
            listingData={this.props.listing}
          />
        );
      };

      return (
        <TouchableHighlight onPress={openDetailView}>
          <Image
            source={{ uri: `data:image/png;base64,${this.state.imageData.val().base64}` }}
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
        </TouchableHighlight>
      );
    }
    return (
      <View style={{ height: fitHeight, borderRadius: 3, backgroundColor: colors.accent }}>
        <View style={styles.paddedCenterContainerClear}>
          <MKSpinner />
        </View>
      </View>
    );
  }

  render() {
    const { width } = Dimensions.get('window');
    const itemMargin = 2;
    const columnWidth = (width / 2) - (itemMargin * 2);

    const listingData = this.props.listing.val();
    const image = listingData.images.image1;

    if (!this.state.imageData || this.state.imageData.key !== image.imageId) {
      this.props.loadImage(image.imageId)
        .then((imageSnapshot) => {
          this.setState({
            imageData: imageSnapshot,
          });
        });
    }

    console.log(`Rendering listing : ${listingData.title} : ${this.props.listing.key} :`
      + ` hasImageData=${this.state.imageData != undefined}`);

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
