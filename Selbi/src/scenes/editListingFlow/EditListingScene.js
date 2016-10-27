import React from 'react';
import { InteractionManager, ScrollView, View, Text, Alert } from 'react-native';
import { connect } from 'react-redux';
import { MKButton } from 'react-native-material-kit';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import SpinnerOverlay from '../../components/SpinnerOverlay';
import VisibilityWrapper from '../../components/VisibilityWrapper';
import LocationPickerComponent from '../../components/editListing/LocationPickerComponent';
import VisibilityPickerComponent from '../../components/editListing/VisibilityPickerComponent';
import UpdateImageComponent from '../../components/editListing/UpdateImageComponent';

import {
  setNewListingTitle,
  setNewListingDescription,
  setNewListingPrice,
  setNewListingStatus,
  setNewListingLocation,
} from '../../reducers/NewListingReducer';

import RoutableScene from '../../nav/RoutableScene';

import { isStringFloat } from '../../utils';
import { updateListingFromStoreAndLoadResult } from '../../firebase/FirebaseActions';
import { loadLocationForListing, changeListingStatus } from '../../firebase/FirebaseConnector';
import { setListingData } from '../../reducers/ListingDetailReducer';

import styles from '../../../styles';
import colors from '../../../colors';
import { reportButtonPress, reportEvent, reportError } from '../../SelbiAnalytics';

const DeleteListingButton = MKButton.flatButton()
  .withStyle({
    borderRadius: 5,
  })
  .withBackgroundColor(colors.secondary)
  .build();


class EditListingScene extends RoutableScene {
  constructor(props, context) {
    super(props, context);
    this.state = {
      overlayOffset: 0,
      renderPlaceholderOnly: true,
    };

    this.recordScrollHeightForOverlay = this.recordScrollHeightForOverlay.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false });
    });
  }

  goHome() {
    this.setState({ storingUpdate: true });

    updateListingFromStoreAndLoadResult(this.props.listingKey, this.props.fullListingData)
      .then((updatedSnapshot) => this.props.setDetails(updatedSnapshot.val()))
      .then(() => {
        reportEvent('update_listing', { listing_id: this.props.listingKey });
        this.goBack();
      })
      .catch((error) => {
        reportError('update_listing_error', { error });
        console.log(error);
        this.setState({ storingUpdate: false });
        Alert.alert(`There was an error updating your listing. ${error.message}`);
      });
  }

  recordScrollHeightForOverlay(event) {
    this.setState({
      overlayOffset: event.nativeEvent.contentOffset.y,
    });
  }

  renderWithNavBar() {
    if (!this.props.listingLocation.lat || !this.props.listingLocation.lon) {
      loadLocationForListing(this.props.listingKey)
        .then((latlon) => {
          if (latlon) {
            this.props.setLocation({
              lat: latlon[0],
              lon: latlon[1],
            });
          }
        });
    }

    if (this.state.renderPlaceholderOnly) {
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

    return (
      <ScrollView onScroll={this.recordScrollHeightForOverlay}>
        <View style={styles.paddedContainer}>

          <UpdateImageComponent
            imageUri={this.props.listingImageUri}
            openCamera={() => this.goNext('camera')}
          />

          <View style={styles.halfPadded} />

          <Text style={{ fontWeight: 'bold' }}>Price (USD)</Text>
          <AutoGrowingTextInput
            style={styles.friendlyTextLeft}
            placeholder="Price"
            keyboardType="numeric"
            value={this.props.listingPrice}
            onChangeText={(newText) => {
              if (isStringFloat(newText)) {
                this.props.setPrice(newText);
              }
            }}
          />

          <Text style={{ fontWeight: 'bold' }}>Title</Text>
          <AutoGrowingTextInput
            style={styles.friendlyTextLeft}
            placeholder="Title"
            value={this.props.listingTitle}
            onChangeText={(newText) => this.props.setTitle(newText)}
          />

          <Text style={{ fontWeight: 'bold' }}>Description</Text>
          <AutoGrowingTextInput
            style={styles.friendlyTextLeft}
            placeholder="Description"
            value={this.props.listingDescription}
            onChangeText={(newText) => this.props.setDescription(newText)}
          />

          <VisibilityPickerComponent
            setStatus={this.props.setStatus}
            setLocation={this.props.setLocation}
            listingStatus={this.props.listingStatus}
          />

          <LocationPickerComponent
            setLocation={this.props.setLocation}
            listingStatus={this.props.listingStatus}
            lat={this.props.listingLocation.lat}
            lon={this.props.listingLocation.lon}
          />

          <View style={styles.padded} />

          <VisibilityWrapper isVisible={this.props.listingStatus !== 'inactive'}>
            <DeleteListingButton
              onPress={() => {
                reportButtonPress('delete_listing_initial');
                Alert.alert('Delete this listing?',
                  `Are you sure you want to delete ${this.props.listingTitle}?`,
                  [
                    {
                      text: 'Cancel',
                    },
                    {
                      text: 'Delete',
                      onPress: () => {
                        this.setState({ storingUpdate: true }, () => {
                          this.props.setStatus('inactive');
                          changeListingStatus('inactive', this.props.listingKey)
                            .then(() => {
                              reportEvent('deleted_listing', { listing_id: this.props.listingKey });
                              this.setState({ storingUpdate: false });
                            })
                            .catch(() => this.setState({ storingUpdate: false }));
                        });
                      },
                    },
                  ]);
              }}
            >
              <Text style={{ color: colors.accent }}>Delete Listing</Text>
            </DeleteListingButton>
          </VisibilityWrapper>
        </View>
        <SpinnerOverlay
          fillParent
          message="Saving updated listing..."
          isVisible={this.state.storingUpdate}
          messageVerticalOffset={this.state.overlayOffset}
        />
      </ScrollView>
    );
  }
}

function getPriceString(state) {
  const price = state.newListing.get('priceString');
  if (price) {
    return price.toString();
  }
  return '';
}

function mapStateToProps(state) {
  return {
    fullListingData: state.newListing,
    title: 'Edit Listing',
    listingStatus: state.newListing.status,
    listingKey: state.newListing.listingId,
    listingTitle: state.newListing.title,
    listingDescription: state.newListing.description,
    listingPrice: getPriceString(state),
    listingImageUri: state.newListing.imageUri,
    listingLocation: {
      lat: state.newListing.locationLat,
      lon: state.newListing.locationLon,
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (title) => dispatch(setNewListingTitle(title)),
    setDescription: (description) => dispatch(setNewListingDescription(description)),
    setPrice: (price) => dispatch(setNewListingPrice(price)),
    setStatus: (status) => dispatch(setNewListingStatus(status)),
    setLocation: (latlon) => dispatch(setNewListingLocation(latlon)),
    setDetails: (listingData) => dispatch(setListingData(listingData)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditListingScene);
