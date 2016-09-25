import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InteractionManager, Image, View, Text, Alert, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MKButton } from 'react-native-material-kit';

import { distanceInMilesString, getGeolocation } from '../utils';

import { getUser, loadImage, loadLocationForListing, loadUserPublicData }
  from '../firebase/FirebaseConnector';

import { setFromExistingListing, clearNewListing } from '../reducers/NewListingReducer';
import { setListingDistance, setListingDetailsSellerData } from '../reducers/ListingDetailReducer';
import { storeImage } from '../reducers/ImagesReducer';

import styles from '../../styles';
import colors from '../../colors';
import RoutableScene from '../nav/RoutableScene';

import LoadingListingComponent from '../components/LoadingListingComponent';
import TopLeftBackButton from '../components/TopLeftBackButton';
import { BuyButton, ChatButton, UpdateButton } from '../components/buttons/ListingDetailButtons';

const buttonViewStyle = {
  flex: 1,
  opacity: 0.7,
  shadowOffset: {
    width: 2,
    height: 2,
  },
  backgroundColor: colors.white,
  shadowColor: 'black',
  shadowOpacity: 1.0,
  marginBottom: 40,
  marginLeft: 20,
  marginRight: 20,
  borderRadius: 5,
};

class DetailBottomButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDescription: false,
    };
  }

  render() {
    if (this.props.isVisible) {
      if (this.props.isSeller) {
        return (
          <View
            style={{
              flex: 1,
              backgroundColor: colors.transparent,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <View style={buttonViewStyle} >
                <UpdateButton openEdit={this.props.openEdit} />
            </View>
          </View>
        );
      }

      const DescriptionText = () => {
        if (!this.props.listingData.description) {
          return <View />;
        }

        const descriptionFontSize = 18;

        if (this.state.showDescription && this.props.listingData.description) {
          return (
            <Text style={{ flex: 1, fontSize: descriptionFontSize  }}>
              {this.props.listingData.description}
            </Text>
          );
        }
        return (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              flex: 1,
              fontSize: descriptionFontSize,
            }}
          >
            {this.props.listingData.description}
          </Text>
        );
      };

      const SellerName = () => {
        if (this.props.sellerData && this.state.showDescription) {
          return <Text style={{ paddingLeft: 8 }}>{this.props.sellerData.displayName}</Text>;
        }
        return <View />;
      };

      const ListingDistance = () => {
        const listingDistanceFontSize = 16;
        if (this.props.listingDistance) {
          return (
            <Text style={{ padding: 8, fontSize: listingDistanceFontSize }}>
              <Icon name="map-marker" size={listingDistanceFontSize} /> {`${this.props.listingDistance} mi.`}
            </Text>
          );
        }
        return <View />;
      };

      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <View style={buttonViewStyle}>
            <TouchableHighlight
              underlayColor={colors.transparent}
              activeOpacity={1}
              onPress={() => this.setState({ showDescription: !this.state.showDescription })}
            >
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 30,
                      paddingTop: 8,
                      paddingLeft: 8,
                      paddingRight: 8,
                      fontWeight: '300',
                    }}>
                      {this.props.listingData.title}
                    </Text>
                    <SellerName style={{ flex: 1 }} />
                  </View>
                  <ListingDistance />
                </View>
                <View style={{ flexDirection: 'row', padding: 8 }}>
                  <DescriptionText />
                </View>
              </View>
            </TouchableHighlight>
            <View style={{ flexDirection: 'row' }}>
              <ChatButton isVisible={this.props.isChatButtonVisible} openChat={this.props.openChat} />
              <BuyButton price={this.props.listingData.price} openEdit={this.props.openEdit} />
            </View>
          </View>
        </View>
      );
    }
    return <View />;
  }
}

DetailBottomButtons.propTypes = {
  isSeller: React.PropTypes.bool.isRequired,
  isChatButtonVisible: React.PropTypes.bool.isRequired,
  openChat: React.PropTypes.func.isRequired,
  openEdit: React.PropTypes.func.isRequired,
};

class ListingDetailScene extends RoutableScene {
  constructor(props, context) {
    super(props, context);
    this.state = {
      renderPlaceholderOnly: true,
      showExtraDetails: true,
    };

    this.toggleShowExtraDetails = this.toggleShowExtraDetails.bind(this);
  }

  toggleShowExtraDetails() {
    this.setState({
      showExtraDetails: !this.state.showExtraDetails,
    });
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false });
    });
  }

  onGoNext(routeName) {
    if (routeName === 'edit') {
      this.props.clearListingDataForEditing();
      this.props.setListingDataForEditing(
        this.props.imageKey,
        this.props.imageData,
        this.props.listingKey,
        this.props.listingData
      );
    }
  }

  loadAndStoreListingDistance() {
    const promiseUserLocation = getGeolocation();
    const promiseListingLocation = loadLocationForListing(this.props.listingKey);

    const toPoint = (latlon) => {
      return {
        lat: latlon[0],
        lon: latlon[1],
      };
    };

    Promise.all([promiseUserLocation, promiseListingLocation])
      .then((userAndListingLocations) => {
        const userLocation = userAndListingLocations[0];
        const listingLocation = userAndListingLocations[1];
        if (listingLocation) {
          this.props.setListingDistanceForDetails(
            distanceInMilesString(
              userLocation,
              toPoint(listingLocation)));
        }
      })
      .catch(console.log);
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

  render() {
    if (!this.props.listingDistance) {
      this.loadAndStoreListingDistance();
    }

    if (!this.props.sellerData) {
      this.loadAndStoreSellerData();
    }

    if (this.state.renderPlaceholderOnly || !this.props.imageData) {
      if (!this.props.imageData) {
        loadImage(this.props.imageKey).then((imageSnapshot) =>
          this.props.storeImageData(imageSnapshot.key, imageSnapshot.val()));
      }

      return <LoadingListingComponent />;
    }

    const imageData = this.props.imageData;
    const listingData = this.props.listingData;

    return (
      <TouchableHighlight
        underlayColor={colors.transparent}
        activeOpacity={1}
        style={{ flex: 1, backgroundColor: colors.dark }}
        onPress={this.toggleShowExtraDetails}
      >
        <Image
          source={{ uri: `data:image/png;base64,${imageData.base64}` }}
          style={{ flex: 1, backgroundColor: colors.dark }}
        >
          <TopLeftBackButton onPress={this.goBack} />
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <DetailBottomButtons
              isVisible={this.state.showExtraDetails}
              isSeller={!!getUser() && listingData.sellerId === getUser().uid}
              listingData={listingData}
              listingDistance={this.props.listingDistance}
              sellerData={this.props.sellerData}
              isChatButtonVisible={!!this.props.routeLinks.chat}
              openChat={() => this.goNext('chat')}
              openEdit={() => this.goNext('edit')}
            />
          </View>
        </Image>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = (state) => {
  const imageStoreKey = state.listingDetails.listingData.images.image1.imageId;
  return {
    title: state.listingDetails.listingData.title,
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
    storeImageData: (imageKey, imageData) => dispatch(storeImage(imageKey, imageData)),
    setListingDataForEditing: (imageKey, imageData, listingKey, listingData) =>
      dispatch(setFromExistingListing(imageKey, imageData, listingKey, listingData)),
    clearListingDataForEditing: () => dispatch(clearNewListing()),
    setListingDistanceForDetails: (distance) => dispatch(setListingDistance(distance)),
    setSellerData: (sellerData) => dispatch(setListingDetailsSellerData(sellerData)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingDetailScene);
