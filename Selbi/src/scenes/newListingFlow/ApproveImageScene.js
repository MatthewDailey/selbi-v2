import React from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';

import RoutableScene from '../../nav/RoutableScene';
import { setNewListingImageDimensions } from '../../reducers/NewListingReducer';

import styles from '../../../styles';

class ApproveImageScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <Image
        onLoadEnd={this.setImageSize}
        onLayout={(event) => {
          Image.getSize(this.props.imageUri,
            this.props.setNewListingImageDimensions,
            () => {
              const { width, height } = event.nativeEvent.layout;
              this.props.setNewListingImageDimensions(width, height);
            });
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
    setNewListingImageDimensions: (width, height) => {
      dispatch(setNewListingImageDimensions(height, width));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApproveImageScene);
