import React from 'react';
import SelbiWebScene from './SelbiWebScene';
import StripeServiceAgreementScene from './StripeServiceAgreementScene';

import { withNavigatorProps } from '../../nav/RoutableScene';

export default undefined;

export const privacyPolicyScene = {
  id: 'privacy_policy_s',
  renderContent: withNavigatorProps(
    <SelbiWebScene endpoint="privacy" leftIs="back" />),
};

export const termsAndConditionsScene = {
  id: 'terms_and_conditions_s',
  renderContent: withNavigatorProps(
    <SelbiWebScene endpoint="terms-and-conditions" leftIs="back" />),
};

export const stripeServiceAgreementScene = {
  id: 'stripe_service_agreement',
  renderContent: withNavigatorProps(
    <StripeServiceAgreementScene leftIs="back" />
  ),
};