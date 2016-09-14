import React from 'react';
import { InteractionManager, ScrollView, View, Text, Image, MapView } from 'react-native';
import { connect } from 'react-redux';
import { mdl, MKRadioButton, MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  setNewListingTitle,
  setNewListingDescription,
  setNewListingPrice,
  setNewListingStatus,
  setNewListingLocation,
  setNewListingImageLocalUri,
  setNewListingImageDimensions
} from '../reducers/NewListingReducer';

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

class DraggableAnnotationExample extends React.Component {
  state = {
    isFirstLoad: true,
    annotations: [],
  };

  createAnnotation = (longitude, latitude) => {
    return {
      longitude,
      latitude,
      draggable: true,
      onDragStateChange: (event) => {
        if (event.state === 'idle') {
          this.setState({
            annotations: [this.createAnnotation(event.longitude, event.latitude)],
          });
        }
        console.log('Drag state: ' + event.state);
      },
    };
  };

  render() {
    if (this.state.isFirstLoad) {
      var onRegionChangeComplete = (region) => {
        //When the MapView loads for the first time, we can create the annotation at the
        //region that was loaded.
        this.setState({
          isFirstLoad: false,
          annotations: [this.createAnnotation(region.longitude, region.latitude)],
        });
      };
    }

    return (
      <MapView
        style={{ height: 160 }}
        onRegionChangeComplete={onRegionChangeComplete}
        region={this.props.region}
        annotations={this.state.annotations}
      />
    );
  }
}



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
                source={{ uri: this.props.listingImageUri }}
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
          value={this.props.listingPrice.toString()}
          onTextChange={(newText) => this.props.setPrice(newText)}
        />
        <TitleInput
          value={this.props.listingTitle}
          onTextChange={(newText) => this.props.setTitle(newText)}
        />
        <DescriptionInput
          value={this.props.listingDescription}
          onTextChange={(newText) => this.props.setDescription(newText)}
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
              <MKRadioButton
                checked={this.props.listingStatus === 'public'}
                group={this.radioGroup}
                onPress={() => this.props.setStatus('public')}
              />
              <Text>Public</Text>
            </View>
            <View>
              <MKRadioButton
                checked={this.props.listingStatus === 'private'}
                group={this.radioGroup}
                onPress={() => this.props.setStatus('private')}
              />
              <Text>Private</Text>
            </View>
            <View>
              <MKRadioButton
                checked={this.props.listingStatus === 'inactive'}
                group={this.radioGroup}
                onPress={() => this.props.setStatus('inactive')}
              />
              <Text>Inactive</Text>
            </View>
            <View>
              <MKRadioButton
                checked={this.props.listingStatus === 'sold'}
                group={this.radioGroup}
                onPress={() => this.props.setStatus('sold')}
              />
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
        <DraggableAnnotationExample
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </ScrollView>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    title: 'Edit Listing',
    listingStatus: state.newListing.status,
    listingKey: state.newListing.listingId,
    listingTitle: state.newListing.title,
    listingDescription: state.newListing.description,
    listingPrice: state.newListing.price,
    listingImageUri: state.newListing.imageUri,
    listingLocation: {
      lat: state.newListing.locationLat,
      lon: state.newListing.locationLon,
    },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTitle: (title) => dispatch(setNewListingTitle(title)),
    setDescription: (description) => dispatch(setNewListingDescription(description)),
    setPrice: (price) => dispatch(setNewListingPrice(price)),
    setStatus: (status) => dispatch(setNewListingStatus(status))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditListingScene);