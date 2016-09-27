import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import LegalNameInputScene from './LegalNameInputScene';
import { MonthInputScene, DayInputScene, YearInputScene } from './DateOfBirthInputScenes';
import { Line1InputScene, Line2InputScene, CityInputScene, PostalInputScene, StateInputScene }
  from './AddressInputScenes';

const legalNameInput = {
  id: 'bank-legal-name-input',
  renderContent: withNavigatorProps(
    <LegalNameInputScene
      title="Add Bank (1/12)"
      leftIs="back"
      rightIs="next"
    />),
};

const dobMonthInput = {
  id: 'bank-legal-dob-month',
  renderContent: withNavigatorProps(
    <MonthInputScene
      title="Add Bank (2/12)"
      leftIs="back"
      rightIs="next"
    />),
};

const dobDayInput = {
  id: 'bank-legal-dob-day',
  renderContent: withNavigatorProps(
    <DayInputScene
      title="Add Bank (3/12)"
      leftIs="back"
      rightIs="next"
    />),
};

const dobYearInput = {
  id: 'bank-legal-dob-year',
  renderContent: withNavigatorProps(
    <YearInputScene
      title="Add Bank (4/12)"
      leftIs="back"
      rightIs="next"
    />),
};

const addressLine1Input = {
  id: 'bank-addres-line1',
  renderContent: withNavigatorProps(
    <Line1InputScene
      title="Add Bank (5/12)"
      leftIs="back"
      rightIs="next"
    />
  ),
};

const addressLine2Input = {
  id: 'bank-addres-line2',
  renderContent: withNavigatorProps(
    <Line2InputScene
      title="Add Bank (6/12)"
      leftIs="back"
      rightIs="next"
    />
  ),
};

const addressCityInput = {
  id: 'bank-address-city',
  renderContent: withNavigatorProps(
    <CityInputScene
      title="Add Bank (7/12)"
      leftIs="back"
      rightIs="next"
    />
  ),
};

const addressPostalInput = {
  id: 'bank-address-postal',
  renderContent: withNavigatorProps(
    <PostalInputScene
      title="Add Bank (8/12)"
      leftIs="back"
      rightIs="next"
    />
  ),
};

const addressStateInput = {
  id: 'bank-address-state',
  renderContent: withNavigatorProps(
    <StateInputScene
      title="Add Bank (9/12)"
      leftIs="back"
      rightIs="next"
    />
  ),
};

const routeLinks = {};

routeLinks[legalNameInput.id] = {
  next: {
    title: 'OK',
    getRoute: () => dobMonthInput,
  },
};

routeLinks[dobMonthInput.id] = {
  next: {
    title: 'OK',
    getRoute: () => dobDayInput,
  },
};

routeLinks[dobDayInput.id] = {
  next: {
    title: 'OK',
    getRoute: () => dobYearInput,
  },
};

routeLinks[dobYearInput.id] = {
  next: {
    title: 'OK',
    getRoute: () => addressLine1Input,
  },
};

routeLinks[addressLine1Input.id] = {
  next: {
    title: 'OK',
    getRoute: () => addressLine2Input,
  },
};

routeLinks[addressLine2Input.id] = {
  next: {
    title: 'OK',
    getRoute: () => addressCityInput,
  },
};

routeLinks[addressCityInput.id] = {
  next: {
    title: 'OK',
    getRoute: () => addressPostalInput,
  },
};

routeLinks[addressPostalInput.id] = {
  next: {
    title: 'OK',
    getRoute: () => addressStateInput,
  },
};

routeLinks[addressStateInput.id] = {
  next: {
    title: 'OK'
  }
};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = legalNameInput;
