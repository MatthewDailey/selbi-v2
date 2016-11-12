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
  id: 'i_bank_legal_name_s',
  renderContent: withNavigatorProps(
    <LegalNameInputScene
      title={`${titleString} (1/6)`}
      leftIs="back"
      rightIs="next"
    />),
};

const dobPicker = {
  id: 'i_bank_dob_s',
  renderContent: withNavigatorProps(
    <DateOfBirthPickerScene
      title={`${titleString} (2/6)`}
      leftIs="back"
      rightIs="next"
    />
  ),
};


const addressAutocompleteScene = {
  id: 'i_bank_address_s',
  renderContent: withNavigatorProps(
    <AddressAutocompleteScene
      title={`${titleString} (3/6)`}
      leftIs="back"
    />
  ),
};

const addressVerifyScene = {
  id: 'i_bank_address_verify_s',
  renderContent: withNavigatorProps(
    <AddressVerifyScene
      title=""
      rightIs="next"
      leftIs="back"
    />
  ),
};

const routingNumberInput = {
  id: 'i_bank_routing_number_s',
  renderContent: withNavigatorProps(
    <RoutingNumberInputScene
      title={`${titleString} (4/6)`}
      leftIs="back"
      rightIs="next"
    />
  ),
};

const accountNumberInput = {
  id: 'i_bank_account_number_s',
  renderContent: withNavigatorProps(
    <AccountNumberInputScene
      title={`${titleString} (5/6)`}
      leftIs="back"
      rightIs="next"
    />
  ),
};

const ssnInput = {
  id: 'i_bank_ssn_s',
  renderContent: withNavigatorProps(
    <SsnInputScene
      title={`${titleString} (6/6)`}
      leftIs="back"
      rightIs="next"
    />
  ),
};

const emailInput = {
  id: 'i_bank_email_s',
  renderContent: withNavigatorProps(
    <AddEmailScene
      title="Check Email"
      leftIs="back"
      rightIs="next"
    />
  ),
};

const storeAccountScene = {
  id: 'bank_submit_s',
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

routeLinks[storeAccountScene.id] = {
  return: {
    numScenes: 9,
  },
};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = emailInput;
