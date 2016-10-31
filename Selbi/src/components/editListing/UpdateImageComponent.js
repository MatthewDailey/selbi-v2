import React from 'react';
import { View, Text, Image } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import colors from '../../../colors';

/*
 * This component is a thumbnail of the passed in image which can be clicked to open the camera.
 */
export default function UpdateImageComponent({ imageUri, openCamera }) {
  const imageContainerCameraIconSize = 40;
  const imageContainerStyle = {
    height: 160,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
      <MKButton
        style={imageContainerStyle}
        onPress={openCamera}
      >
        <Image
          source={{ uri: imageUri }}
          resizeMode="cover"
          style={{ height: imageContainerStyle.height, width: imageContainerStyle.width }}
        />
        <Text
          style={{
            position: 'absolute',
            backgroundColor: colors.transparent,
            top: (imageContainerStyle.height - imageContainerCameraIconSize) / 2,
            left: (imageContainerStyle.width - imageContainerCameraIconSize) / 2,
          }}
        >
          <Icon name="camera" size={imageContainerCameraIconSize} color={colors.dark} />
        </Text>
      </MKButton>
    </View>
  );
}
UpdateImageComponent.propTypes = {
  imageUri: React.PropTypes.string.isRequired,
  openCamera: React.PropTypes.func.isRequired,
};
