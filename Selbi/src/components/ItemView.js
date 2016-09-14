import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, Image, TouchableHighlight } from 'react-native';
import { MKSpinner } from 'react-native-material-kit';

import { loadImage, getUser } from '../firebase/FirebaseConnector';
import { storeImage } from '../reducers/ImagesReducer';
import { setListingDetails } from '../reducers/ListingDetailReducer';

// noinspection Eslint - Dimensions provided by react-native env.
import Dimensions from 'Dimensions';

import styles from '../../styles';
import colors from '../../colors';

class ItemView extends Component {
  getImageView(fitHeight) {
    if (this.props.imageData) {
      const openDetailView = () => {
        this.props.setListingDetails(this.props.listing.key, this.props.listing.val());
        this.props.openDetailScene();
      };
      return (
        <TouchableHighlight onPress={openDetailView}>
          <Image
            key={this.props.imageKey}
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
      loadImage(this.props.imageKey)
        .then((imageSnapshot) => this.props.storeImageData(imageSnapshot.key, imageSnapshot.val()));
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
  imageKey: React.PropTypes.string.isRequired,
  imageData: React.PropTypes.object, // Value for /images/$imageKey
  storeImageData: React.PropTypes.func.isRequired,
  openDetailScene: React.PropTypes.func.isRequired,
  setListingDetails: React.PropTypes.func.isRequired,
};

// TODO: Get ride of hard coded image1.
const mapStateToProps = (state, currentProps) => {
  const imageId = currentProps.listing.val().images.image1.imageId;
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
      setListingDetails(
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
