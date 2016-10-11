import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import BankIntroScene from './BankIntroScene';
import LegalNameInputScene from './LegalNameInputScene';
import RoutingNumberInputScene from './RoutingNumberInputScene';
import AccountNumberInputScene from './AccountNumberInputScene';
import SsnInputScene from './SsnInputScene';
import StoreBankAccountScene from './StoreBankAccountScene';
import DateOfBirthPickerScene from './DateOfBirthPickerScene';
import AddressAutocompleteScene from './AddressAutocompleteScene';
import AddressVerifyScene from './AddressVerifyScene';

const titleString = 'Add Bank';

const legalNameInput = {
  id: 'bank-legal-name-input',
  renderContent: withNavigatorProps(
    <LegalNameInputScene
      title={`${titleString} (1/6)`}
      leftIs="back"
      rightIs="next"
    />),
};

const dobPicker = {
  id: 'bank-legal-dob-picker',
  renderContent: withNavigatorProps(
    <DateOfBirthPickerScene
      title={`${titleString} (2/6)`}
      leftIs="back"
      rightIs="next"
    />
  ),
};


const addressAutocompleteScene = {
  id: 'address-autocomplete',
  renderContent: withNavigatorProps(
    <AddressAutocompleteScene
      title={`${titleString} (3/6)`}
      leftIs="back"
    />
  ),
};

const addressVerifyScene = {
  id: 'address-verify-scene',
  renderContent: withNavigatorProps(
    <AddressVerifyScene
      title=""
      rightIs="next"
      leftIs="back"
    />
  ),
};

const routingNumberInput = {
  id: 'bank-routing-number',
  renderContent: withNavigatorProps(
    <RoutingNumberInputScene
      title={`${titleString} (4/6)`}
      leftIs="back"
      rightIs="next"
    />
  ),
};

const accountNumberInput = {
  id: 'bank-account-number',
  renderContent: withNavigatorProps(
    <AccountNumberInputScene
      title={`${titleString} (5/6)`}
      leftIs="back"
      rightIs="next"
    />
  ),
};

const ssnInput = {
  id: 'bank-ssn-input',
  renderContent: withNavigatorProps(
    <SsnInputScene
      title={`${titleString} (6/6)`}
      leftIs="back"
      rightIs="next"
    />
  ),
};

const storeAccountScene = {
  id: 'bank-store-account',
  renderContent: withNavigatorProps(
    <StoreBankAccountScene
      title="Review Account Details"
      leftIs="back"
    />
  ),
};

const routeLinks = {};

routeLinks[legalNameInput.id] = {
  next: {
    title: 'OK',
    getRoute: () => dobPicker,
  },
};

routeLinks[dobPicker.id] = {
  next: {
    title: 'OK',
    getRoute: () => addressAutocompleteScene,
  },
};

routeLinks[addressAutocompleteScene.id] = {
  next: {
    title: '',
    getRoute: () => addressVerifyScene,
  },
};

routeLinks[addressVerifyScene.id] = {
  next: {
    title: 'Approve Address',
    getRoute: () => routingNumberInput,
  },
};

routeLinks[routingNumberInput.id] = {
  next: {
    title: 'OK',
    getRoute: () => accountNumberInput,
  },
};

routeLinks[accountNumberInput.id] = {
  next: {
    title: 'OK',
    getRoute: () => ssnInput,
  },
};

routeLinks[ssnInput.id] = {
  next: {
    title: 'OK',
    getRoute: () => storeAccountScene,
  }
};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = legalNameInput;
