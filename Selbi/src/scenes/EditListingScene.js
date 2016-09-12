import React from 'react';
import { InteractionManager, ScrollView, View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { mdl, MKRadioButton, MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import { updateListingStore } from '../reducers/ListingDetailReducer';
import { loadImage } from '../firebase/FirebaseConnector';

import RoutableScene from '../nav/RoutableScene';

import styles from '../../styles';
import colors from '../../colors';

const TitleInput = mdl.Textfield.textfieldWithFloatingLabel()
  .withPlaceholder('Title')
  .withHighlightColor(colors.dark)
  .withStyle({
    height: 48,  // have to do it on iOSfd
    marginTop: 10,
  })
  .build();

const DescriptionInput = mdl.Textfield.textfieldWithFloatingLabel()
  .withPlaceholder('Description (Optional)')
  .withHighlightColor(colors.dark)
  .withStyle({
    height: 48,  // have to do it on iOS
    marginTop: 10,
  })
  .build();

const PriceInput = mdl.Textfield.textfieldWithFloatingLabel()
  .withPlaceholder('Price (USD)')
  .withHighlightColor(colors.dark)
  .withStyle({
    height: 48,  // have to do it on iOS
    marginTop: 10,
  })
  .build();

class EditListingScene extends RoutableScene {
  constructor(props, context) {
    super(props, context);
    this.state = { renderPlaceholderOnly: true };

    this.radioGroup = new MKRadioButton.Group();
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false });
    });
  }

  renderWithNavBar() {
    if (this.state.renderPlaceholderOnly || !this.props.imageData) {
      if (!this.props.imageData) {
        loadImage(this.props.imageKey).then((imageSnapshot) =>
          this.props.storeImageData(imageSnapshot.key, imageSnapshot.val()));
      }

      return (
        <View
          style={{
            flex: 1,
            backgroundColor: `${colors.dark}`,
          }}
        >
          <View style={styles.paddedCenterContainerClear}>
            <Text
              color={colors.white}
              style={styles.friendlyTextLight}
            >
              Loading listing...
            </Text>
          </View>
        </View>
      );
    }

    const imageContainerStyle = {
      height: 50,
      width: 50,
      borderWidth: 1,
      borderColor: colors.dark,
      backgroundColor: `${colors.dark}22`,
      margin: 4,
      alignItems: 'center',
      justifyContent: 'center',
    };

    return (
      <ScrollView style={styles.paddedContainer}>
        <View
          style={{
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            <View style={imageContainerStyle} >
              <Image
                key={this.props.imageKey}
                source={{ uri: `data:image/png;base64,${this.props.imageData.base64}` }}
                resizeMode="cover"
                style={{ height: 48, width: 48 }}
              />
            </View>
            <MKButton style={imageContainerStyle}>
              <Text><Icon name="camera" size={20} color={colors.dark} /></Text>
            </MKButton>
            <View style={imageContainerStyle} />
            <View style={imageContainerStyle} />
            <View style={imageContainerStyle} />
          </View>
        </View>

        <PriceInput
          value={this.props.listingData.price.toString()}
        />
        <TitleInput
          value={this.props.listingData.title}
        />
        <DescriptionInput
          value={this.props.listingData.description}
        />

        <View
          style={{
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          <Text>Listing Visibility</Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <View>
              <MKRadioButton checked group={this.radioGroup} />
              <Text>Public</Text>
            </View>
            <View>
              <MKRadioButton group={this.radioGroup} />
              <Text>Private</Text>
            </View>
            <View>
              <MKRadioButton group={this.radioGroup} />
              <Text>Inactive</Text>
            </View>
            <View>
              <MKRadioButton group={this.radioGroup} />
              <Text>Sold</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          <MKButton>
            <Text>Location: San Francisco</Text>
            <Text>Tap to update.</Text>
          </MKButton>
        </View>

      </ScrollView>
    );
  }
}


const mapStateToProps = (state) => {
  const imageStoreKey = state.listingDetails.listingData.images.image1.imageId;
  return {
    title: 'Edit Listing',
    listingKey: state.listingDetails.listingKey,
    listingData: state.listingDetails.listingData,
    imageKey: imageStoreKey,
    imageData: state.images[imageStoreKey],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateListing: (listingData) => {
      dispatch(updateListingStore(listingData));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditListingScene);