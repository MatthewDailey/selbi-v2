import React from 'react';
import { ScrollView, View, Text, InteractionManager, Image } from 'react-native';
import { connect } from 'react-redux';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import RoutableScene from '../../nav/RoutableScene';

import { loadImage, loadUserPublicData, purchaseListing } from '../../firebase/FirebaseConnector';

import { setListingDetailsSellerData } from '../../reducers/ListingDetailReducer';
import { storeImage } from '../../reducers/ImagesReducer';

import LoadingListingComponent from '../../components/LoadingListingComponent';

import styles from '../../../styles';
import colors from '../../../colors';


const FlatButton = MKButton.flatButton()
  .withStyle({
    borderRadius: 5,
  })
  .withBackgroundColor(colors.white)
  .build();

const Button = MKButton.button()
  .withStyle({
    borderRadius: 5,
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
      <View style={{ alignItems: 'flex-end' }}>
        <FlatButton onPress={takeAction}>
          <Text style={{ fontSize: 16 }}>
            {actionText} <Icon name="arrow-right" />
          </Text>
        </FlatButton>
      </View>
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
            <CheckBox
              checked={this.props.sellerData.hasBankAccount}
              title="Seller accepts Pay with Selbi"
              takeAction={() => this.goNext('chat')}
              actionText="RequestSeller accept Pay with Selbi"
            />
          </View>
          <View style={styles.halfPadded}>
            <CheckBox
              checked={this.props.hasPaymentMethod}
              title="Payment method set up"
              takeAction={() => this.goNext('addPayment')}
              actionText="Add a credit card"
            />
          </View>

          <View style={styles.halfPadded} />

          <View style={styles.halfPadded}>
            <Button onPress={() => purchaseListing(this.props.listingKey)}>
              <Text>Pay with Selbi</Text>
            </Button>
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
    setSellerData: (sellerData) => dispatch(setListingDetailsSellerData(sellerData)),
    storeImageData: (imageKey, imageData) => dispatch(storeImage(imageKey, imageData)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingReceiptScene);
