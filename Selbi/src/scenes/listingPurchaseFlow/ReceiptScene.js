import React from 'react';
import { View, Text, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import RoutableScene from '../../nav/RoutableScene';

import LoadingListingComponent from '../../components/LoadingListingComponent'

import styles from '../../../styles';
import colors from '../../../colors';

const Button = MKButton.button()
  .withStyle({
    borderRadius: 5,
  })
  .withBackgroundColor(colors.white)
  .build();

class ListingReceiptScene extends RoutableScene {
  constructor(props, context) {
    super(props, context);
    this.state = {
      renderPlaceholderOnly: true,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false });
    });
  }

  renderWithNavBar() {
    if (this.state.renderPlaceholderOnly) {
      return <LoadingListingComponent />;
    }

    return (
      <View style={styles.paddedContainer}>
        <Text style={styles.friendlyText}>
          {`Your listing is visible and ready to sell to ${this.props.visibleTo}.`}
        </Text>
        <Text style={styles.friendlyText}>
          <Icon name="smile-o" size={30} />
        </Text>
        <Text style={styles.friendlyText}>
          To sell faster, we recommend adding more details.
        </Text>
        <View style={styles.halfPadded}>
          <Button onPress={() => this.goNext()}>
            <Text>Add Details</Text>
          </Button>
        </View>
      </View>
    );
  }
}


const mapStateToProps = (state) => {
  const imageStoreKey = state.listingDetails.listingData.images.image1.imageId;
  return {
    listingKey: state.listingDetails.listingKey,
    listingData: state.listingDetails.listingData,
    listingDistance: state.listingDetails.listingDistance,
    sellerData: state.listingDetails.sellerData,
    imageKey: imageStoreKey,
    imageData: state.images[imageStoreKey],
    buyerUid: state.listingDetails.buyerUid,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    // TODO
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingReceiptScene);
