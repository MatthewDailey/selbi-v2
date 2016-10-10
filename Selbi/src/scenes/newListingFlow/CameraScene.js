import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import Camera from 'react-native-camera';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import colors from '../../../colors';
import RoutableScene from '../../nav/RoutableScene';
import SpinnerOverlay from '../../components/SpinnerOverlay';
import OpenSettingsComponent from '../../nav/OpenSettingsComponent';

import styles from '../../../styles';

const ColoredRaisedButton = MKButton
  .accentColoredFab()
  .build();

function CameraButton({ takePicture }) {
  return (
    <View
      style={{
        bottom: 100,
        height: 0,
        alignSelf: 'center',
      }}
    >
      <ColoredRaisedButton onPress={takePicture}>
        <Icon name="camera" size={20} color={colors.secondary} />
      </ColoredRaisedButton>
    </View>
  );
}

CameraButton.propTypes = {
  takePicture: React.PropTypes.func.isRequired,
};

class CameraScene extends RoutableScene {
  constructor(props) {
    super(props);
    this.state = {
      capturing: false,
    };

    this.takePicture = this.takePicture.bind(this);
  }

  toggleCapturing() {
    this.setState({
      capturing: !this.state.capturing,
    });
  }

  takePicture() {
    this.toggleCapturing();
    this.camera.capture()
      .then((data) => {
        this.props.setNewListingImageLocalUri(data.path);
        this.toggleCapturing();
        this.goNext();
      })
      .catch(err => console.error(err));
  }

  renderWithNavBar() {
    if (!this.props.hasCameraAccess) {
      return <OpenSettingsComponent missingPermission="camera" />;
    }
    // Unclear why the subview in camara is needed. The camera preview would not show up properly
    // without it.
    return (
      <View style={styles.container} >
        <Camera
          captureAudio={false}
          ref={(cam) => { this.camera = cam; }}
          style={{ flex: 1 }}
          aspect={Camera.constants.Aspect.fill}
        >
          <View />
        </Camera>
        <CameraButton takePicture={this.takePicture} />
        <SpinnerOverlay isVisible={this.state.capturing} message="Capturing photo..." />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    hasCameraAccess: state.permissions.camera === 'authorized',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNewListingImageLocalUri: (uri) => {
      dispatch(setNewListingImageLocalUri(uri));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CameraScene);
