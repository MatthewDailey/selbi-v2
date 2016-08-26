import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Image,
  View,
} from 'react-native';
import Camera from 'react-native-camera';
import {
  MKButton,
  MKSpinner,
  setTheme,
} from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import colors from '../../colors';
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

setTheme({
  primaryColor: colors.primaryColor,
});

const spinnerSize = 80;


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
          console.log('store::: ');
          console.log(this.props.store.getState());
          this.props.store.dispatch(setNewListingImageLocalUri(data.path));
          this.toggleCapturing();
          this.goNext();
        })
        .catch(err => console.error(err));
    };

    const getSpinner = () => {
      if (this.state.capturing) {
        return (
          <MKSpinner
            style={{
              flex: 1,
              top: 50,
              left: (this.state.viewWidth - spinnerSize) / 2,
              height: spinnerSize,
              width: spinnerSize,
              position: 'absolute',
            }}
          />);
      }
      return undefined;
    };

    const getShutterButton = () => {
      const ColoredRaisedButton = MKButton
        .coloredFab()
        .withOnPress(takePicture)
        .build();

      return (
        <View
          style={{
            bottom: 50,
          }}
        >
          <ColoredRaisedButton>
            <Icon name="camera" size={20} color={colors.secondary} />
          </ColoredRaisedButton>
        </View>
      );
    };

    return (
      <View
        style={styles.container}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          this.setState({
            viewWidth: width,
            viewHeight: height,
          });
        }}
      >
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
        >

          {getShutterButton()}
        </Camera>
        {getSpinner()}
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
        source={{ uri: this.props.store.getState().newListing.get('imageUri')}}
      />
    );
  }
}
