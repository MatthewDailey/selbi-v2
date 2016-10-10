import React from 'react';
import { View, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import RoutableScene from '../../nav/RoutableScene'

import colors from '../../../colors';
import config from '../../../config';
import styles from '../../../styles';

export default class AddressAutocompleteScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <View style={styles.container}>
        <View style={styles.padded}>
          <Text style={styles.friendlyTextLeft}>What is the bank account owner's address?</Text>
        </View>
        <GooglePlacesAutocomplete
          placeholder="Search"
          minLength={2} // minimum length of text to search
          autoFocus
          listViewDisplayed="auto"    // true/false/undefined
          fetchDetails
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            console.log(data);
            console.log(details);
          }}
          getDefaultValue={() => {
            return ''; // text input default value
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: config.googleBrowserKey,
            language: 'en', // language of the results
            types: 'geocode', // default: 'geocode'. Enables address search.
          }}
          styles={{
            textInputContainer: {
              backgroundColor: colors.secondary,
              borderTopWidth: 0,
              borderBottomWidth: 0,
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              height: 38,
              color: colors.black,
              fontSize: 25,
              fontWeight: '300',
            },
            description: {
              fontSize: 20,
              fontWeight: '300',
            },
            row: {
              height: 50,
            }
          }}

          nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        />
      </View>
    );
  }
}