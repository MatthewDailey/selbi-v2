import React from 'react';
import SelbiWebScene from './SelbiWebScene';

import { withNavigatorProps } from '../../nav/RoutableScene';

export default undefined;

export const privacyPolicyScene = {
  id: 'privacy-policy-scene',
  renderContent: withNavigatorProps(
    <SelbiWebScene endpoint="privacy" leftIs="back" />),
};

export const termsAndConditionsScene = {
  id: 'terms-and-conditions-scene',
  renderContent: withNavigatorProps(
    <SelbiWebScene endpoint="terms-and-conditions" leftIs="back" />),
};
