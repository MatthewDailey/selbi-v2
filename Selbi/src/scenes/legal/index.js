import React from 'react';
import SelbiWebScene from './SelbiWebScene';

export default undefined;

export const privacyPolicyScene = {
  id: 'privacy-policy-scene',
  renderContent: () => <SelbiWebScene endpoint="privacy" leftIs="back" />,
};

export const termsAndConditionsScene = {
  id: 'terms-and-conditions-scene',
  renderContent: () => <SelbiWebScene endpoint="terms-and-conditions" leftIs="back" />,
};
