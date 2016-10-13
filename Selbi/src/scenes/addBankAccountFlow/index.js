import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import LegalNameInputScene from './LegalNameInputScene';
import RoutingNumberInputScene from './RoutingNumberInputScene';
import AccountNumberInputScene from './AccountNumberInputScene';
import SsnInputScene from './SsnInputScene';
import StoreBankAccountScene from './StoreBankAccountScene';
import DateOfBirthPickerScene from './DateOfBirthPickerScene';
import AddressAutocompleteScene from './AddressAutocompleteScene';
import AddressVerifyScene from './AddressVerifyScene';
import AddEmailScene from './AddBankEmailScene';

const titleString = 'Add Bank';

const legalNameInput = {
  id: 'input_bank_legal_name_scene',
  renderContent: withNavigatorProps(
    <LegalNameInputScene
      title={`${titleString} (1/6)`}
      leftIs="back"
      rightIs="next"
    />),
};

const dobPicker = {
  id: 'input_bank_dob_scene',
  renderContent: withNavigatorProps(
    <DateOfBirthPickerScene
      title={`${titleString} (2/6)`}
      leftIs="back"
      rightIs="next"
    />
  ),
};


const addressAutocompleteScene = {
  id: 'input_bank_address_scene',
  renderContent: withNavigatorProps(
    <AddressAutocompleteScene
      title={`${titleString} (3/6)`}
      leftIs="back"
    />
  ),
};

const addressVerifyScene = {
  id: 'input_address_verify_scene',
  renderContent: withNavigatorProps(
    <AddressVerifyScene
      title=""
      rightIs="next"
      leftIs="back"
    />
  ),
};

const routingNumberInput = {
  id: 'input_bank_routing_number_scene',
  renderContent: withNavigatorProps(
    <RoutingNumberInputScene
      title={`${titleString} (4/6)`}
      leftIs="back"
      rightIs="next"
    />
  ),
};

const accountNumberInput = {
  id: 'input_bank_account_number_scene',
  renderContent: withNavigatorProps(
    <AccountNumberInputScene
      title={`${titleString} (5/6)`}
      leftIs="back"
      rightIs="next"
    />
  ),
};

const ssnInput = {
  id: 'input_bank_ssn_scene',
  renderContent: withNavigatorProps(
    <SsnInputScene
      title={`${titleString} (6/6)`}
      leftIs="back"
      rightIs="next"
    />
  ),
};

const emailInput = {
  id: 'input_bank_email_scene',
  renderContent: withNavigatorProps(
    <AddEmailScene
      title="Check Email"
      leftIs="back"
      rightIs="next"
    />
  ),
};

const storeAccountScene = {
  id: 'bank_submit_scene',
  renderContent: withNavigatorProps(
    <StoreBankAccountScene
      title="Review Account Details"
      leftIs="back"
    />
  ),
};

const routeLinks = {};

routeLinks[emailInput.id] = {
  next: {
    title: 'OK',
    getRoute: () => legalNameInput,
  },
};

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
  },
};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = emailInput;
