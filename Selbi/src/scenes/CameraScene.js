import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Image,
  Text,
  View,
} from 'react-native';
import Camera from 'react-native-camera';

import RoutableScene from '../nav/RoutableScene';
import {
  setNewListingImageLocalUri,
  setNewListingImageDimensions,
} from '../reducers/NewListingReducer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height - 44,
    width: Dimensions.get('window').width,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
  },
});


export class SimpleCamera extends RoutableScene {
  constructor(props) {
    super(props);
    this.state = {
      capturing: false,
    };
  }

  toggleCapturing() {
    this.setState({
      capturing: !this.state.capturing,
    });
  }

  renderWithNavBar() {
    const takePicture = () => {
      this.toggleCapturing();
      this.camera.capture()
        .then((data) => {
          console.log(`Capturing::: ${this.state.capturing}`);
          console.log(`store::: ${this.props.store.getState()}`);
          this.props.store.dispatch(setNewListingImageLocalUri(data.path));
          this.toggleCapturing();
          this.goNext();
        })
        .catch(err => console.error(err));
    };

    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
        >
          <Text
            style={styles.capture}
            onPress={takePicture}
          >
            [CAPTURE]
          </Text>
        </Camera>
      </View>
    );
  }
}

export class SimpleImageView extends RoutableScene {
  renderWithNavBar() {
    return (
      <Image
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          this.props.store.dispatch(setNewListingImageDimensions(height, width));
        }}
        style={styles.preview}
        source={{ uri: this.props.store.getState().get('imageUri')}}
      />
    );
  }
}
