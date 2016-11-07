import React from 'react';
import { ScrollView, View, Text, InteractionManager, Image, Alert } from 'react-native';
import { connect } from 'react-redux';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import RoutableScene from '../../nav/RoutableScene';

import { loadImage, loadUserPublicData, purchaseListing } from '../../firebase/FirebaseConnector';

import { setListingDetailsSellerData } from '../../reducers/ListingDetailReducer';
import { storeImage } from '../../reducers/ImagesReducer';

import LoadingListingComponent from '../../components/LoadingListingComponent';
import SpinnerOverlay from '../../components/SpinnerOverlay';
import VisibilityWrapper from '../../components/VisibilityWrapper';

import styles from '../../../styles';
import colors from '../../../colors';
import { reportPurchase, reportButtonPress } from '../../SelbiAnalytics';


const FlatButton = MKButton.flatButton()
  .withStyle({
    borderRadius: 5,
  })
  .withBackgroundColor(colors.white)
  .build();

const Button = MKButton.flatButton()
  .withStyle({
    borderRadius: 5,
    borderWidth: 1,
  })
  .withBackgroundColor(colors.white)
  .build();

const GreenCheck = () => <Icon name="check-square-o" size={20} color="green" />;
const EmptyCheck = () => <Icon name="square-o" size={20} />;

function CheckBox({ checked, title, takeAction, actionText }) {
  if (checked) {
    return (
      <Text style={styles.friendlyTextLeft}>
        <GreenCheck /> {title}
      </Text>
    );
  }
  return (
    <View>
      <Text style={styles.friendlyTextLeft}>
        <EmptyCheck /> {title}
      </Text>
      <View style={styles.halfPadded} />
      <Button onPress={takeAction}>
        <Text>
          {actionText}
        </Text>
      </Button>
    </View>
  );
}
CheckBox.propTypes = {
  checked: React.PropTypes.bool,
  title: React.PropTypes.string.isRequired,
  takeAction: React.PropTypes.func.isRequired,
  actionText: React.PropTypes.string.isRequired,
};

class ListingReceiptScene extends RoutableScene {
  constructor(props, context) {
    super(props, context);
    this.state = {
      renderPlaceholderOnly: true,
      purchasing: false,
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
    if (this.state.renderPlaceholderOnly
      || (!this.props.imageUrl && !this.props.imageData)
      || !this.props.sellerData) {
      if (!this.props.imageUrl && !this.props.imageData) {
        loadImage(this.props.imageKey).then((imageSnapshot) =>
          this.props.storeImageData(imageSnapshot.key, imageSnapshot.val()));
      }

      if (!this.props.sellerData) {
        this.loadAndStoreSellerData();
      }

      return <LoadingListingComponent />;
    }

    let imageUri = this.props.imageUrl;
    if (this.props.imageData) {
      imageUri = `data:image/png;base64,${this.props.imageData.base64}`;
    }

    // TODO ScrollView Could be in a better place.
    return (
      <View style={styles.container}>
        <ScrollView>
          <Image
            source={{ uri: imageUri }}
            style={{ flex: 1, backgroundColor: colors.dark }}
          />
          <View style={{ flex: 1, padding: 16 }}>
            <View style={styles.halfPadded}>
              <Text style={styles.friendlyTextLeftLarge}>{this.props.listingData.title}</Text>
              <Text>{this.props.sellerData.displayName}</Text>
            </View>
            <View style={styles.halfPadded}>
              <Text style={styles.friendlyTextLeftMed}>{`$${this.props.listingData.price}`}</Text>
            </View>

            <View style={styles.halfPadded} />

            <View style={styles.halfPadded}>
              <CheckBox
                checked={this.props.sellerData.hasBankAccount}
                title="Seller accepts payment"
                takeAction={() => {
                  reportButtonPress('request_seller_accept_payment');
                  this.goNext('chat');
                }}
                actionText="Ask seller to accept payments"
              />
            </View>
            <View style={styles.halfPadded}>
              <CheckBox
                checked={this.props.hasPaymentMethod}
                title="Payment method set up"
                takeAction={() => {
                  reportButtonPress('add_payment');
                  this.goNext('addPayment');
                }}
                actionText="Add a credit card"
              />
            </View>

            <View style={styles.halfPadded} />

            <VisibilityWrapper
              isVisible={this.props.hasPaymentMethod && this.props.sellerData.hasBankAccount}
              style={styles.halfPadded}
            >
              <Button
                onPress={() => {
                  const doPayment = () => this.setState({ purchasing: true }, () => {
                    reportButtonPress('pay_with_selbi', { listing_id: this.props.listingKey });
                    purchaseListing(this.props.listingKey)
                      .then(() => {
                        reportPurchase(this.props.listingData.price, this.props.listingKey);
                        this.setState({ purchasing: false });
                        this.goNext();
                      })
                      .catch((error) => {
                        Alert.alert(error);
                        console.log(error);
                        this.setState({ purchasing: false });
                      });
                  });

                  Alert.alert(
                    'Confirm Purchase',
                    `Your credit card will be charged $${this.props.listingData.price}`,
                    [{ text: 'Pay', onPress: doPayment }, { text: 'Cancel', style: 'cancel' }]);
                }}
              >
                <Text>Submit Payment</Text>
              </Button>
            </VisibilityWrapper>

            <View style={styles.padded} />
          </View>
        </ScrollView>
        <SpinnerOverlay isVisible={this.state.purchasing} message="Completing payment..." />
      </View>
    );
  }
}


const mapStateToProps = (state) => {
  const imageStoreKey = state.listingDetails.listingData.images.image1.imageId;
  const imageUrl = state.listingDetails.listingData.images.image1.url;
  return {
    listingKey: state.listingDetails.listingKey,
    listingData: state.listingDetails.listingData,
    listingDistance: state.listingDetails.listingDistance,
    sellerData: state.listingDetails.sellerData,
    imageKey: imageStoreKey,
    imageUrl,
    imageData: state.images[imageStoreKey],
    buyerUid: state.listingDetails.buyerUid,
    hasPaymentMethod: state.user.hasPayment,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setSellerData: (sellerData) => dispatch(setListingDetailsSellerData(sellerData)),
    storeImageData: (imageKey, imageData) => dispatch(storeImage(imageKey, imageData)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingReceiptScene);
