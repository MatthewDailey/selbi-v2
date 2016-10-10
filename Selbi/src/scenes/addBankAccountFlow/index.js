import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import LegalNameInputScene from './LegalNameInputScene';
import { Line1InputScene, Line2InputScene, CityInputScene, PostalInputScene, StateInputScene }
  from './AddressInputScenes';
import RoutingNumberInputScene from './RoutingNumberInputScene';
import AccountNumberInputScene from './AccountNumberInputScene';
import SsnInputScene from './SsnInputScene';
import StoreBankAccountScene from './StoreBankAccountScene';
import DateOfBirthPickerScene from './DateOfBirthPickerScene';
import AddressAutocompleteScene from './AddressAutocompleteScene';
import AddressVerifyScene from './AddressVerifyScene';

const legalNameInput = {
  id: 'bank-legal-name-input',
  renderContent: withNavigatorProps(
    <LegalNameInputScene
      title="Add Bank (1/6)"
      leftIs="back"
      rightIs="next"
    />),
};

const dobPicker = {
  id: 'bank-legal-dob-picker',
  renderContent: withNavigatorProps(
    <DateOfBirthPickerScene
      title="Add Bank (2/6)"
      leftIs="back"
      rightIs="next"
    />
  ),
};


const addressAutocompleteScene = {
  id: 'address-autocomplete',
  renderContent: withNavigatorProps(
    <AddressAutocompleteScene
      title="Add Bank (3/6)"
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
      title="Add Bank (4/6)"
      leftIs="back"
      rightIs="next"
    />
  ),
};

const accountNumberInput = {
  id: 'bank-account-number',
  renderContent: withNavigatorProps(
    <AccountNumberInputScene
      title="Add Bank (5/6)"
      leftIs="back"
      rightIs="next"
    />
  ),
};

const ssnInput = {
  id: 'bank-ssn-input',
  renderContent: withNavigatorProps(
    <SsnInputScene
      title="Add Bank (6/6)"
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
