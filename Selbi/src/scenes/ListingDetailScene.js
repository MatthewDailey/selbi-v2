import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InteractionManager, Image, View, Text, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';

import { distanceInMilesString, getGeolocation } from '../utils';

import { getUser, loadImage, loadLocationForListing, loadUserPublicData, listenToListing }
  from '../firebase/FirebaseConnector';

import { setFromExistingListing, clearNewListing } from '../reducers/NewListingReducer';
import { setListingDistance, setListingDetailsSellerData, setListingData }
  from '../reducers/ListingDetailReducer';
import { storeImage } from '../reducers/ImagesReducer';

import styles, { paddingSize } from '../../styles';
import colors from '../../colors';
import RoutableScene from '../nav/RoutableScene';

import LoadingListingComponent from '../components/LoadingListingComponent';
import TopLeftBackButton from '../components/TopLeftBackButton';
import DetailMenuButton from '../components/DetailMenuButton';
import { BuyButton, ChatButton, UpdateButton, ShareButton }
  from '../components/buttons/ListingDetailButtons';
import VisibilityWrapper from '../components/VisibilityWrapper';

import { reportButtonPress } from '../SelbiAnalytics';

import { getListingShareUrl } from '../deeplinking/Utilities';

const detailBottomOverlayStyle = {
  flex: 1,
  opacity: 0.7,
  shadowOffset: {
    width: 2,
    height: 2,
  },
  backgroundColor: colors.white,
  shadowColor: 'black',
  shadowOpacity: 1.0,
  margin: 20,
  padding: paddingSize / 2,
  borderRadius: 5,
};

function DescriptionText({ description, showFullDescription }) {
  if (!description) {
    return <View />;
  }

  const descriptionFontSize = 18;

  if (showFullDescription && description) {
    return (
      <Text style={{ flex: 1, fontSize: descriptionFontSize }}>
        {description}
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
      {description}
    </Text>
  );
}
DescriptionText.propTypes = {
  description: React.PropTypes.string,
  showFullDescription: React.PropTypes.bool,
};

class DetailBottomButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDescription: false,
    };
  }

  render() {
    const isSold = this.props.listingData.status === 'sold';
    const isDeleted = this.props.listingData.status === 'inactive';

    if (this.props.isSeller && !isSold) {
      const bottomOverlayStyleMinusPadding = Object.assign({}, detailBottomOverlayStyle);
      delete bottomOverlayStyleMinusPadding.padding;
      bottomOverlayStyleMinusPadding.backgroundColor = colors.transparent;
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
          <View style={bottomOverlayStyleMinusPadding}>
            <ShareButton
              onPress={() => {
                reportButtonPress('bottom_buttons_share');
                Share.open({ url: getListingShareUrl(this.props.listingKey) }).catch(console.log);
              }}
            />
            <View style={styles.halfPadded} />
            <UpdateButton onPress={this.props.openEdit} />
          </View>
        </View>
      );
    }

    const SellerName = () => {
      if (this.props.sellerData) {
        return (
          <VisibilityWrapper isVisible={this.state.showDescription && !!this.props.sellerData}>
            <Text>{this.props.sellerData.displayName}</Text>
          </VisibilityWrapper>
        );
      }
      return <View />;
    };

    const Title = () => (
      <Text style={{ fontSize: 30, fontWeight: '300' }}>{this.props.listingData.title}</Text>
    );

    const ListingDistance = ({ distanceString }) => {
      if (this.props.listingDistance) {
        const distanceFontSize = 16;
        return (
          <Text style={{ fontSize: distanceFontSize }}>
            <Icon name="map-marker" size={distanceFontSize} /> {`${distanceString} mi.`}
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
        <View style={detailBottomOverlayStyle}>
          <TouchableHighlight
            underlayColor={colors.transparent}
            activeOpacity={1}
            onPress={() => this.setState({ showDescription: !this.state.showDescription })}
          >
            <View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                  <Title />
                  <SellerName />
                </View>
                <ListingDistance distanceString={this.props.listingDistance} />
              </View>
              <View style={styles.quarterPadded} />
              <View style={{ flexDirection: 'row' }}>
                <DescriptionText
                  showFullDescription={this.state.showDescription}
                  description={this.props.listingData.description}
                />
              </View>
              <View style={styles.quarterPadded} />
              <VisibilityWrapper isVisible={isSold}>
                <Text style={{ flex: 1, fontSize: 20 }}>
                  SOLD - ${this.props.listingData.price}
                </Text>
              </VisibilityWrapper>
              <VisibilityWrapper isVisible={isDeleted}>
                <Text style={{ flex: 1, fontSize: 20 }}>
                  This listing has been deleted.
                </Text>
              </VisibilityWrapper>
            </View>
          </TouchableHighlight>
          <VisibilityWrapper isVisible={!isSold && !isDeleted}>
            <View style={{ flexDirection: 'row' }}>
              <ChatButton
                isVisible={this.props.isChatButtonVisible}
                onPress={this.props.openChat}
              />
              <BuyButton
                price={this.props.listingData.price}
                onPress={this.props.openBuy}
              />
            </View>
          </VisibilityWrapper>
        </View>
      </View>
    );
  }
}

DetailBottomButtons.propTypes = {
  listingKey: React.PropTypes.string.isRequired,
  listingData: React.PropTypes.object.isRequired,
  listingDistance: React.PropTypes.string,
  sellerData: React.PropTypes.object,
  isSeller: React.PropTypes.bool.isRequired,
  isChatButtonVisible: React.PropTypes.bool.isRequired,
  openChat: React.PropTypes.func.isRequired,
  openEdit: React.PropTypes.func.isRequired,
  openBuy: React.PropTypes.func.isRequired,
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

    this.unbindListingListener = listenToListing(
      this.props.listingKey,
      this.props.setListingDetailsData);
  }

  componentWillReceiveProps(nextProps) {
    if (this.unbindListingListener &&
      (nextProps.listingKey !== this.props.listingKey || !this.props.listingData)) {
      this.unbindListingListener();
      this.unbindListingListener = listenToListing(
        this.props.listingKey,
        this.props.setListingDetailsData);
    }
  }

  componentWillUnmount() {
    if (this.unbindListingListener) {
      this.unbindListingListener();
    }
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
    if (!this.props.listingData) {
      return <LoadingListingComponent />;
    }

    if (!this.props.listingDistance) {
      this.loadAndStoreListingDistance();
    }

    if (!this.props.sellerData) {
      this.loadAndStoreSellerData();
    }

    if (this.state.renderPlaceholderOnly || (!this.props.imageUri && !this.props.imageData)) {
      if (!this.props.imageUri && !this.props.imageData && this.props.imageKey) {
        loadImage(this.props.imageKey)
          .then((imageSnapshot) =>
            this.props.storeImageData(imageSnapshot.key, imageSnapshot.val()))
          .catch((error) => console.log('Failure loading image in ListingDetailScene', error));
      }

      return <LoadingListingComponent />;
    }

    const imageData = this.props.imageData;
    const listingData = this.props.listingData;
    const isSeller = !!getUser() && listingData.sellerId === getUser().uid;

    const imageUri = this.props.imageUri ? this.props.imageUri :
      `data:image/png;base64,${imageData.base64}`;

    return (
      <TouchableHighlight
        underlayColor={colors.transparent}
        activeOpacity={1}
        style={{ flex: 1, backgroundColor: colors.dark }}
        onPress={this.toggleShowExtraDetails}
      >
        <Image
          key={this.props.imageKey}
          source={{ uri: imageUri }}
          style={{ flex: 1, backgroundColor: colors.dark }}
        >
          <TopLeftBackButton onPress={this.goBack} />
          <DetailMenuButton listingId={this.props.listingKey} />
          <VisibilityWrapper
            isVisible={this.state.showExtraDetails}
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <DetailBottomButtons
              isSeller={isSeller}
              listingKey={this.props.listingKey}
              listingData={listingData}
              listingDistance={this.props.listingDistance}
              sellerData={this.props.sellerData}
              isChatButtonVisible={!!this.props.routeLinks.chat}
              openChat={() => {
                reportButtonPress('listing_details_chat');
                this.goNext('chat');
              }}
              openEdit={() => {
                reportButtonPress('listing_details_edit');
                this.goNext('edit');
              }}
              openBuy={() => {
                reportButtonPress('listing_details_buy');
                this.goNext('buy');
              }}
            />
          </VisibilityWrapper>
        </Image>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    listingKey: state.listingDetails.listingKey,
    listingData: state.listingDetails.listingData,
    listingDistance: state.listingDetails.listingDistance,
    sellerData: state.listingDetails.sellerData,
    imageKey: undefined,
    imageData: undefined,
    buyerUid: state.listingDetails.buyerUid,
  };

  if (state.listingDetails.listingData) {
    const imageStoreKey = state.listingDetails.listingData.images.image1.imageId;
    const imageUri = state.listingDetails.listingData.images.image1.url;

    if (imageUri) {
      props.imageUri = imageUri;
    } else {
      props.imageKey = imageStoreKey;
      props.imageData = state.images[imageStoreKey];
    }
  }

  return props;
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeImageData: (imageKey, imageData) => dispatch(storeImage(imageKey, imageData)),
    setListingDataForEditing: (imageKey, imageData, listingKey, listingData) =>
      dispatch(setFromExistingListing(imageKey, imageData, listingKey, listingData)),
    clearListingDataForEditing: () => dispatch(clearNewListing()),
    setListingDistanceForDetails: (distance) => dispatch(setListingDistance(distance)),
    setSellerData: (sellerData) => dispatch(setListingDetailsSellerData(sellerData)),
    setListingDetailsData: (listingData) => dispatch(setListingData(listingData)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingDetailScene);
