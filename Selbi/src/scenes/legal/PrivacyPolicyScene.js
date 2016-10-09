import React from 'react';
import { WebView } from 'react-native';

import RoutableScene from '../../nav/RoutableScene';

export default class PrivacyPolicyScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <WebView
        source={{ uri: 'https://selbi-staging.appspot.com/privacy' }}
      />
    );
  }
}
