import React from 'react';
import { View, Text } from 'react-native';
import ImageReader from '@selbi/react-native-image-reader';

import styles from '../../styles';
import RoutableScene from '../nav/RoutableScene';

export default class PublishScene extends RoutableScene {
  componentDidMount() {
    const newListing = this.props.store.getState().newListing;

    ImageReader
      .readImage(newListing.imageUri)
      .then((imageBase64) => this.props.publishImage(
        imageBase64[0],
        newListing.imageHeight,
        newListing.imageWidth))
      .then((imageKey) => this.props.createListing(
        newListing.title,
        '', // description
        newListing.price,
        {
          image1: {
            imageId: imageKey,
            width: newListing.imageWidth,
            height: newListing.imageHeight,
          },
        },
        '' // category
      ))
      .then(console.log)
      .catch(console.log);
  }

  renderWithNavBar() {
    return (
      <View style={styles.container}>
        <Text>Successfully posted.</Text>
        <Text>Get ready to get paid!</Text>
      </View>
    );
  }
}
