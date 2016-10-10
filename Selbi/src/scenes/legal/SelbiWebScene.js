import React from 'react';
import { WebView } from 'react-native';

import RoutableScene from '../../nav/RoutableScene';
import config from '../../../config';

export default class SelbiWebScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <WebView
        source={{ uri: `${config.domain}/${this.props.endpoint}` }}
      />
    );
  }
}

SelbiWebScene.propTypes = {
  endpoint: React.PropTypes.string.isRequired,
};
