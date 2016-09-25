import React from 'react';
import { View } from 'react-native';

export default function VisibilityWrapper({ isVisible = false, children, style }) {
  if (isVisible) {
    return <View style={style}>{children}</View>;
  }
  return <View />;
}
VisibilityWrapper.propTypes = {
  isVisible: React.PropTypes.bool,
  children: React.PropTypes.element.isRequired,
  style: React.PropTypes.object,
};
