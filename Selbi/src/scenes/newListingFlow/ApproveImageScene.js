import React from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';

import RoutableScene from '../../nav/RoutableScene';
import { setNewListingImageDimensions } from '../../reducers/NewListingReducer';

import styles from '../../../styles';

class SimpleImageView extends RoutableScene {
  renderWithNavBar() {
    return (
      <Image
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          this.props.setNewListingImageDimensions(height, width);
        }}
        style={styles.container}
        source={{ uri: this.props.imageUri }}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    imageUri: state.newListing.imageUri,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNewListingImageDimensions: (height, width) => {
      dispatch(setNewListingImageDimensions(height, width));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleImageView);
