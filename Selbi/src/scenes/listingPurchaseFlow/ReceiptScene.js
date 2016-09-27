import React from 'react';
import { ScrollView, View, Text, InteractionManager, Image, Alert } from 'react-native';
import { connect } from 'react-redux';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import RoutableScene from '../../nav/RoutableScene';

import { loadImage, loadUserPublicData } from '../../firebase/FirebaseConnector';

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
const EmptyCheck = () => <Icon name="square-o" size={20} />

function SellerAcceptsPaymentCheckBox({ checked, takeAction }) {
  if (checked) {
    return (
      <Text style={styles.friendlyTextLeft}>
        <GreenCheck /> Seller accepts Pay by Selbi
      </Text>
    );
  }
  return (
    <View>
      <Text style={styles.friendlyTextLeft}>
        <EmptyCheck /> Seller accepts Pay by Selbi
      </Text>
      <View style={{ alignItems: 'flex-end' }}>
        <FlatButton onPress={takeAction}>
          <Text style={{ fontSize: 16 }}>
            Request seller accept Pay by Selbi <Icon name="arrow-right" />
          </Text>
        </FlatButton>
      </View>
    </View>
  );
}
SellerAcceptsPaymentCheckBox.propTypes = {
  checked: React.PropTypes.bool,
  takeAction: React.PropTypes.func.isRequired,
};

function PaymentMethodCheckBox({ checked, takeAction }) {
  if (checked) {
    return (
      <Text style={styles.friendlyTextLeft}>
        <GreenCheck /> Payment method set up
      </Text>
    );
  }
  return (
    <View>
      <Text style={styles.friendlyTextLeft}>
        <EmptyCheck /> Payment method set up
      </Text>
      <View style={{ alignItems: 'flex-end' }}>
        <FlatButton onPress={takeAction}>
          <Text style={{ fontSize: 16 }}>Add a credit card <Icon name="arrow-right"/></Text>
        </FlatButton>
      </View>
    </View>
  );
}
PaymentMethodCheckBox.propTypes = {
  checked: React.PropTypes.bool,
  takeAction: React.PropTypes.func.isRequired,
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
          <Text style={styles.friendlyTextLeftLarge}>{this.props.listingData.title}</Text>
          <Text style={styles.friendlyTextLeft}>{`Price: $${this.props.listingData.price}`}</Text>

          <View style={styles.halfPadded} />

          <SellerAcceptsPaymentCheckBox
            checked={this.props.sellerData.hasBankAccount}
            takeAction={() => Alert.alert('Not yet implemented')}
          />
          <PaymentMethodCheckBox
            checked={this.props.hasPaymentMethod}
            takeAction={() => this.goNext('addPayment')}
          />

          <View style={styles.halfPadded} />

          <View style={styles.halfPadded}>
            <Button onPress={() => this.goNext()}>
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
