import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, Image, TouchableHighlight } from 'react-native';
import { MKSpinner } from 'react-native-material-kit';

import { loadImage, getUser } from '../firebase/FirebaseConnector';
import { storeImage } from '../reducers/ImagesReducer';
import { setBuyerAndListingDetails } from '../reducers/ListingDetailReducer';

// noinspection Eslint - Dimensions provided by react-native env.
import Dimensions from 'Dimensions';

import styles from '../../styles';
import colors from '../../colors';

class ItemView extends Component {
  getImageFromUri(uri, fitHeight, openDetailView) {
    return (
      <TouchableHighlight onPress={openDetailView}>
        <Image
          key={this.props.imageKey}
          source={{ uri }}
          style={{ height: fitHeight, borderRadius: 3, backgroundColor: colors.primary }}
        >
          <Text
            style={{
              margin: 5,
              color: 'white',
              textShadowColor: colors.dark,
              textShadowOffset: {
                width: 1,
                height: 1,
              },
              textShadowRadius: 2,
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

  getImageView(fitHeight) {
    const openDetailView = () => {
      this.props.setListingDetails(this.props.listing.key, this.props.listing.val());
      this.props.openDetailScene();
    };

    if (this.props.imageData) {
      return this.getImageFromUri(
        `data:image/png;base64,${this.props.imageData.base64}`,
        fitHeight,
        openDetailView);
    }

    if (this.props.imageUri) {
      return this.getImageFromUri(
        this.props.imageUri,
        fitHeight,
        openDetailView);
    }

    return <View style={{ height: fitHeight, borderRadius: 3, backgroundColor: colors.primary }} />;
  }

  render() {
    const { width } = Dimensions.get('window');
    const itemMargin = 2;
    const columnWidth = (width / 2) - (itemMargin * 2);

    const image = this.props.listing.val().images.image1;

    if (!this.props.imageUri && (!this.props.imageData || this.props.imageKey !== image.imageId) ) {
      loadImage(this.props.imageKey)
        .then((imageSnapshot) => this.props.storeImageData(imageSnapshot.key, imageSnapshot.val()))
        .catch(console.log);
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

ItemView.propTypes = {
  listing: React.PropTypes.object.isRequired, // Should be the entire firebase ref value.
  imageUri: React.PropTypes.string,
  imageKey: React.PropTypes.string,
  imageData: React.PropTypes.object, // Value for /images/$imageKey
  storeImageData: React.PropTypes.func.isRequired,
  openDetailScene: React.PropTypes.func.isRequired,
  setListingDetails: React.PropTypes.func.isRequired,
};

// TODO: Get ride of hard coded image1.
const mapStateToProps = (state, currentProps) => {
  const imageId = currentProps.listing.val().images.image1.imageId;
  const imageUri = currentProps.listing.val().images.image1.url;

  if (imageUri) {
    return {
      imageUri,
    };
  }

  return {
    imageKey: imageId,
    imageData: state.images[imageId],
  };
};

function getUserUid() {
  const user = getUser();
  if (user) {
    return user.uid;
  }
  return undefined;
}

const mapDispatchToProps = (dispatch) => {
  return {
    storeImageData: (imageKey, imageData) => dispatch(storeImage(imageKey, imageData)),
    setListingDetails: (listingKey, listingData) => dispatch(
      setBuyerAndListingDetails(
        getUserUid(),
        {
          key: listingKey,
          data: listingData,
        })
    ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemView);
