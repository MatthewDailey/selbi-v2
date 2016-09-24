import React from 'react';
import { connect } from 'react-redux';
import { InteractionManager, Image, View, Text, Alert, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MKButton } from 'react-native-material-kit';

import { getUser, loadImage } from '../firebase/FirebaseConnector';

import { setFromExistingListing, clearNewListing } from '../reducers/NewListingReducer';
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
  marginBottom: 40,
  marginLeft: 20,
  marginRight: 20,
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
        <Icon name="heart-o" size={30} color={colors.white} />
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
  .withBackgroundColor(colors.white)
  .withOnPress(() => Alert.alert('Sorry, not yet supported.'))
  .build();

function ChatButton({ isVisible, openChat }) {
  if (isVisible) {
    return (
      <Button
        onPress={openChat}
      >
        <Text>MESSAGE</Text>
      </Button>
    );
  }
  return <View />;
}
ChatButton.propTypes = {
  isVisible: React.PropTypes.bool.isRequired,
  openChat: React.PropTypes.func.isRequired,
};

function DetailBottomButtons({ isSeller, isChatButtonVisible, openChat, openEdit }) {
  if (isSeller) {
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
          <Button onPress={openEdit}>
            <Text>Update Listing</Text>
          </Button>
        </View>
      </View>
    );
  }

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
        <ChatButton isVisible={isChatButtonVisible} openChat={openChat} />
      </View>
      <View style={buttonViewStyle}>
        <Button>
          <Text>BUY</Text>
        </Button>
      </View>
    </View>
  );
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
      showExtraDetails: false,
    };

    this.toggleShowExtraDetails = this.toggleShowExtraDetails.bind(this);
  }

  toggleShowExtraDetails() {
    console.log(`Toggling show extra details. New value=${!this.state.showExtraDetails}`);
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

  renderWithNavBar() {
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
        onPress={this.toggleShowExtraDetails}
        style={styles.container}
      >
        <Image
          source={{ uri: `data:image/png;base64,${imageData.base64}` }}
          style={styles.container}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <DetailTopInfo price={listingData.price} />
            <DetailBottomButtons
              isSeller={!!getUser() && listingData.sellerId === getUser().uid}
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingDetailScene);
