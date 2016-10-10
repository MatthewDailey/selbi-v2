import React from 'react';
import { WebView } from 'react-native';

import RoutableScene from '../../nav/RoutableScene';
import config from '../../../config';

export default class StripeServiceAgreementScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <WebView
        source={{ uri: 'https://stripe.com/us/connect-account/legal' }}
      />
    );
  }
}

