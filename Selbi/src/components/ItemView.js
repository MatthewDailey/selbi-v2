import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, Image, TouchableHighlight } from 'react-native';
import { MKSpinner } from 'react-native-material-kit';

import { loadImage } from '../firebase/FirebaseConnector';
import { storeImage } from '../reducers/ImagesReducer';

// noinspection Eslint - Dimensions provided by react-native env.
import Dimensions from 'Dimensions';

import ListingDetailScene from '../scenes/ListingDetailScene';

import styles from '../../styles';
import colors from '../../colors';

class ItemView extends Component {
  getImageView(fitHeight) {
    if (this.props.imageData) {
      const openDetailView = () => {
        this.props.openSimpleScene(
          <ListingDetailScene
            title={this.props.listing.val().title}
            leftIs="back"
            imageData={this.props.imageData}
            listingData={this.props.listing}
          />
        );
      };

      return (
        <TouchableHighlight onPress={openDetailView}>
          <Image
            source={{ uri: `data:image/png;base64,${this.props.imageData.base64}` }}
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
              {`$${this.props.listing.val().price}`}
            </Text>
          </Image>
        </TouchableHighlight>
      );
    }
    return (
      <View style={{ height: fitHeight, borderRadius: 3, backgroundColor: colors.primary }}>
        <View style={styles.paddedCenterContainerClear}>
          <MKSpinner strokeColor={colors.secondary} />
        </View>
      </View>
    );
  }

  render() {
    const { width } = Dimensions.get('window');
    const itemMargin = 2;
    const columnWidth = (width / 2) - (itemMargin * 2);

    const image = this.props.listing.val().images.image1;

    if (!this.props.imageData || this.props.imageKey !== image.imageId) {
      console.log('rendered but no image data');
      console.log(this.props.imageKey)
      loadImage(this.props.imageKey)
        .then((imageSnapshot) => {
          console.log('successfully loaded image');
          this.props.storeImageData(imageSnapshot.key, imageSnapshot.val());
        });
    }

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
        {this.getImageView(fitHeight)}
      </View>
    );
  }
}

// TODO: Get ride of hard coded image1.
const mapStateToProps = (state, currentProps) => {
  const imageId = currentProps.listing.val().images.image1.imageId;
  return {
    imageKey: imageId,
    imageData: state.images[imageId],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeImageData: (imageKey, imageData) => dispatch(storeImage(imageKey, imageData)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemView);


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
