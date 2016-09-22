import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import Camera from 'react-native-camera';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import colors from '../../../colors';
import RoutableScene from '../../nav/RoutableScene';
import { setNewListingImageLocalUri } from '../../reducers/NewListingReducer';
import SpinnerOverlay from '../../components/SpinnerOverlay';

import styles from '../../../styles';

class CameraScene extends RoutableScene {
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
          this.props.setNewListingImageLocalUri(data.path);
          this.toggleCapturing();
          this.goNext();
        })
        .catch(err => console.error(err));
    };

    const getShutterButton = () => {
      const ColoredRaisedButton = MKButton
        .accentColoredFab()
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
      <View style={styles.container} >
        <Camera
          captureAudio={false}
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.cameraPreview}
          aspect={Camera.constants.Aspect.fill}
        >

          {getShutterButton()}
        </Camera>
        <SpinnerOverlay isVisible={this.state.capturing} message="Capturing photo..." />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setNewListingImageLocalUri: (uri) => {
      dispatch(setNewListingImageLocalUri(uri));
    },
  };
};

export default connect(
  undefined,
  mapDispatchToProps
)(CameraScene);
