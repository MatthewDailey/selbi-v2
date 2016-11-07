import React from "react";
import {connect} from "react-redux";
import {View, InteractionManager} from "react-native";
import Camera from "react-native-camera";
import {MKButton} from "react-native-material-kit";
import Icon from "react-native-vector-icons/FontAwesome";
import Permissions from "react-native-permissions";
import RoutableScene from "../../nav/RoutableScene";
import {setNewListingImageLocalUri} from "../../reducers/NewListingReducer";
import {setSinglePermission} from "../../reducers/PermissionsReducer";
import SpinnerOverlay from "../../components/SpinnerOverlay";
import OpenSettingsComponent from "../../nav/OpenSettingsComponent";
import styles from "../../../styles";
import colors from "../../../colors";

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
      renderPlaceholderOnly: true,
    };

    this.takePicture = this.takePicture.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false });
    });
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
    if (!this.props.hasCameraAccess || !this.props.hasPhotoAccess) {
      Permissions.requestPermission('camera')
        .then(this.props.setCameraPermission);
      Permissions.requestPermission('photo')
        .then(this.props.setPhotoPermission);
      return <OpenSettingsComponent missingPermission="camera and photo" />;
    }

    if (this.state.renderPlaceholderOnly) {
      return (
        <View style={styles.container} />
      );
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
    hasPhotoAccess: state.permissions.photo === 'authorized',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNewListingImageLocalUri: (uri) => {
      dispatch(setNewListingImageLocalUri(uri));
    },
    setCameraPermission: (permissionState) => dispatch(
      setSinglePermission('camera', permissionState)),
    setPhotoPermission: (permissionState) => dispatch(
      setSinglePermission('photo', permissionState)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CameraScene);
