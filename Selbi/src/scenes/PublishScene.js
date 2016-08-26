import React from 'react';
import { View, Text } from 'react-native';

import styles from '../../styles';
import RoutableScene from '../nav/RoutableScene';
import ImageReader from '@selbi/react-native-image-reader';

export default class PublishScene extends RoutableScene {
  componentDidMount() {
    const newListing = this.props.store.getState().newListing;
    console.log(newListing);
    ImageReader
      .readImage(newListing.imageUri)
      .then((imageBase64) => this.props.publishImage(imageBase64[0], newListing.imageHeight,
        newListing.imageWidth))
      .then((imageKey) => this.props.createListing(
        'title',
        'no desc yet',
        1,
        {
          image1: {
            imageId: imageKey,
            width: newListing.imageWidth,
            height: newListing.imageHeight,
          },
        },
        'unknown category'
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