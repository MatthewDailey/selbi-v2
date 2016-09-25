import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InteractionManager, Image, View, Text, Alert, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MKButton } from 'react-native-material-kit';

// noinspection Eslint - Dimensions provided by react-native env.
import Dimensions from 'Dimensions';

import { distanceInMilesString, getGeolocation } from '../utils';

import { getUser, loadImage, loadLocationForListing, loadUserPublicData } from '../firebase/FirebaseConnector';

import { setFromExistingListing, clearNewListing } from '../reducers/NewListingReducer';
import { setListingDistance, setListingDetailsSellerData } from '../reducers/ListingDetailReducer';
import { storeImage } from '../reducers/ImagesReducer';

import styles from '../../styles';
import colors from '../../colors';
import RoutableScene from '../nav/RoutableScene';
import LoadingListingComponent from '../components/LoadingListingComponent';

const fontStyle = {
  padding: 10,
  color: 'white',
  textShadowColor: colors.dark,
  textShadowOffset: {
    width: 1,
    height: 1,
  },
  textShadowRadius: 2,
  fontSize: 30,
  backgroundColor: 'transparent',
};

const buttonViewStyle = {
  flex: 1,
  opacity: 0.7,
  shadowOffset: {
    width: 2,
    height: 2,
  },
  shadowColor: 'black',
  shadowOpacity: 1.0,
  marginBottom: 40,
  marginLeft: 20,
  marginRight: 20,
};

const actionButtonStyle = {
  flex: 1,
  padding: 8,
  margin: 2,
  fontSize: 20,
  fontWeight: 'bold',
  textAlign: 'center',
  backgroundColor: colors.primary,
};

function DetailTopInfo({ price }) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Text style={fontStyle}>{`$${price}`}</Text>
      <Text style={fontStyle}>
        <Icon name="star-o" size={30} color={colors.white} />
      </Text>
    </View>
  );
}
DetailTopInfo.propTypes = {
  price: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired,
};

const Button = MKButton.button()
  .withStyle({
    borderRadius: 5,
    padding: 15,
  })
  .build();

const LeftButton = MKButton.button()
  .withStyle({
    flex: 1,
    marginLeft: 4,
    marginRight: 2,
    marginBottom:4,
  })
  .withBackgroundColor(colors.primary)
  .withOnPress(() => Alert.alert('Sorry, not yet supported.'))
  .build();

const RightButton = MKButton.button()
  .withStyle({
    flex: 1,
    marginLeft: 2,
    marginRight: 4,
    marginBottom:4,
  })
  .withBackgroundColor(colors.primary)
  .withOnPress(() => Alert.alert('Sorry, not yet supported.'))
  .build();

function ChatButton({ isVisible, openChat }) {
  if (isVisible) {
    return (
      <LeftButton onPress={openChat}>
        <Text><Icon name="commenting-o" size={20} /></Text>
      </LeftButton>
    );
  }
  return <View />;
}
ChatButton.propTypes = {
  isVisible: React.PropTypes.bool.isRequired,
  openChat: React.PropTypes.func.isRequired,
};

function BuyButton({ price }) {
  return (
    <RightButton onPress={() => Alert.alert('Not yet supported.')}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}><Icon name="usd" size={20} /> {price}</Text>
    </RightButton>
  );
}

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
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <View style={buttonViewStyle}>
              <Button onPress={this.props.openEdit}>
                <Text>Update Listing</Text>
              </Button>
            </View>
          </View>
        );
      }

      const DescriptionText = () => {
        if (!this.props.listingData.description) {
          return <View />;
        }

        if (this.state.showDescription && this.props.listingData.description) {
          return (
            <Text style={{ flex: 1 }}>
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
        if (this.props.listingDistance) {
          return <Text style={{ padding: 8 }}>{`${this.props.listingDistance} miles away`}</Text>;
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
              underlayColor={colors.white}
              onPress={() => this.setState({ showDescription: !this.state.showDescription })}
              activeOpacity={0.5}
            >
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 25,
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

function ExtraDetailsOverlay({
    isVisible,
    description,
    sellerName,
    sellerDistance }) {
  if (isVisible) {
    const { width, height } = Dimensions.get('window');

    const backgroundStyle = {
      position: 'absolute',
      paddingTop: 50,
      paddingLeft: 20,
      paddingRight: 20,
      top: 0,
      left: 0,
      height,
      width,
      backgroundColor: `${colors.dark}aa`,
    };

    let visibleDescription = `Message ${sellerName} for more info.`;
    if (description) {
      visibleDescription = description;
    }

    let visibleDistance = 'Private listing, distance unknown.';
    if (sellerDistance) {
      visibleDistance = `${sellerDistance} miles away.`;
    }

    return (
      <View style={backgroundStyle}>
        <Text style={styles.friendlyHeaderLightLeftAlign}>{sellerName}</Text>
        <Text style={styles.friendlyHeaderLightLeftAlign}>{visibleDistance}</Text>
        <Text style={styles.friendlyTextLightLeftAlign}>{visibleDescription}</Text>
      </View>
    );
  }
  return <View />;
}

ExtraDetailsOverlay.propTypes = {
  isVisible: React.PropTypes.bool,
  description: React.PropTypes.string,
  sellerName: React.PropTypes.string,
  sellerDistance: React.PropTypes.string,
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
        onPress={this.toggleShowExtraDetails}
        style={styles.container}
      >
        <Image
          source={{ uri: `data:image/png;base64,${imageData.base64}` }}
          style={styles.container}
        >
            <TouchableHighlight
              style={{
                alignItems: 'center',
                paddingTop: 32,
                paddingLeft: 8,
                height: 64,
                width: 48,
                opacity: 0.7,
              }}
              onPress={this.goBackHandler}
              underlayColor={colors.transparent}
              activeOpacity={0.5}
            >
              <Text
                style={{
                  textShadowColor: colors.dark,
                  textShadowOffset: {
                    width: 1,
                    height: 1,
                  },
                  textShadowRadius: 2,
                }}
              ><Icon name="chevron-left" size={18} color={colors.secondary} /></Text>
            </TouchableHighlight>
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
              isChatButtonVisible={!!this.props.routeLinks.chat}
              openChat={() => this.goNext('chat')}
              openEdit={() => this.goNext('edit')}
              sellerData={this.props.sellerData}
              listingDistance={this.props.listingDistance}
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
