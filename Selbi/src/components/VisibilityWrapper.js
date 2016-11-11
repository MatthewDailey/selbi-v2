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
  children: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.array]).isRequired,
};
