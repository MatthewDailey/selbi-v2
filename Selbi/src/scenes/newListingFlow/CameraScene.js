import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Camera from 'react-native-camera';
import {
  MKButton,
  setTheme,
} from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import colors from '../../../colors';
import RoutableScene from '../../nav/RoutableScene';
import {
  setNewListingImageLocalUri,
} from '../../reducers/NewListingReducer';
import SpinnerOverlay from '../SpinnerOverlay';

import styles from '../../../styles';

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
          this.props.store.dispatch(setNewListingImageLocalUri(data.path));
          this.toggleCapturing();
          this.goNext();
        })
        .catch(err => console.error(err));
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
        style={localStyles.container}
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
          style={localStyles.preview}
          aspect={Camera.constants.Aspect.fill}
        >

          {getShutterButton()}
        </Camera>
        <SpinnerOverlay isVisible={this.state.capturing} message="Capturing photo..." />
      </View>
    );
  }
}

