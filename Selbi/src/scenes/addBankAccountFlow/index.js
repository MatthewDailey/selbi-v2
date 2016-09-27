import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import LegalNameInputScene from './LegalNameInputScene';
import { MonthInputScene, DayInputScene, YearInputScene } from './DateOfBirthInputScenes';

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
  id: 'bank-legal-dob-month',
  renderContent: withNavigatorProps(
    <YearInputScene
      title="Add Bank (4/12)"
      leftIs="back"
      rightIs="next"
    />),
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

module.exports.routeLinks = routeLinks;
module.exports.firstScene = legalNameInput;
