import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Image,
  Text,
  View,
} from 'react-native';
import Camera from 'react-native-camera';

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


export class SimpleCamera extends Component {
  render() {
    const takePicture = () => {
      this.camera.capture()
        .then((data) => {
          this.props.listingStore.imgPath = data.path;
          this.props.openNext();
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

export class SimpleImageView extends Component {
  render() {
    return (
      <Image
        style={styles.preview}
        source={{ uri: this.props.listingStore.imgPath }}
      />
    );
  }
}
