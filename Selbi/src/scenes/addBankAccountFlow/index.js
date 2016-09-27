import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import LegalNameInputScene from './LegalNameInputScene';


const legalNameInput = {
  id: 'bank-legal-name-input',
  renderContent: withNavigatorProps(
    <LegalNameInputScene
      title="Add Bank (1/12)"
      leftIs="back"
      rightIs="next"
    />),
};

const routeLinks = {};


module.exports.routeLinks = routeLinks;
module.exports.firstScene = legalNameInput;
