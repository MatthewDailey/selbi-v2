import React from 'react';
import { ScrollView, View, Text, InteractionManager, Image } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import RoutableScene from '../../nav/RoutableScene';

import { loadImage, loadUserPublicData } from '../../firebase/FirebaseConnector';

import { storeImage } from '../../reducers/ImagesReducer';

import LoadingListingComponent from '../../components/LoadingListingComponent';
import SpinnerOverlay from '../../components/SpinnerOverlay';

import styles from '../../../styles';
import colors from '../../../colors';


const GreenCheck = () => <Icon name="check-square-o" size={20} color="green" />;

class CompletedPurchaseScene extends RoutableScene {
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

  loadAndStoreSellerData() {
    loadUserPublicData(this.props.listingData.sellerId)
      .then((sellerData) => {
        if (sellerData && sellerData.exists()) {
          this.props.setSellerData(sellerData.val());
        }
      })
      .catch(console.log);
  }

  renderWithNavBar() {
    if (this.state.renderPlaceholderOnly || !this.props.imageData || !this.props.sellerData) {
      if (!this.props.imageData) {
        loadImage(this.props.imageKey).then((imageSnapshot) =>
          this.props.storeImageData(imageSnapshot.key, imageSnapshot.val()));
      }

      if (!this.props.sellerData) {
        this.loadAndStoreSellerData();
      }

      return <LoadingListingComponent />;
    }

    // TODO ScrollView Could be in a better place.
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: `data:image/png;base64,${this.props.imageData.base64}` }}
          style={{ flex: 1, backgroundColor: colors.dark }}
        />
        <ScrollView style={{ flex: 2, padding: 16 }}>
          <View style={styles.halfPadded}>
            <Text style={styles.friendlyTextLeftLarge}>{this.props.listingData.title}</Text>
            <Text>{this.props.sellerData.displayName}</Text>
          </View>
          <View style={styles.halfPadded}>
            <Text style={styles.friendlyTextLeftMed}>{`$${this.props.listingData.price}`}</Text>
          </View>

          <View style={styles.halfPadded} />

          <View style={styles.halfPadded}>
            <Text style={styles.friendlyTextLeft}>
              <GreenCheck /> Purchase Complete
            </Text>
          </View>

          <View style={styles.halfPadded}>
            <Text style={styles.friendlyTextLeft}>
              You will receive a receipt in your email shortly.
            </Text>
          </View>

          <View style={styles.padded} />
        </ScrollView>
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
    hasPaymentMethod: state.user.hasPayment,
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
)(CompletedPurchaseScene);
