import React from 'react';

import { withNavigatorProps } from '../../nav/RoutableScene';

import EditListingScene from '../EditListingScene';

import SimpleCamera from '../newListingFlow/CameraScene';
import ApproveImageScene from '../newListingFlow/ApproveImageScene';


const editListingScene = {
  id: 'edit-listing-scene',
  renderContent: withNavigatorProps(<EditListingScene leftIs="back" rightIs="home" />),
};

const cameraScene = {
  id: 'edit-camera-scene',
  renderContent: withNavigatorProps(
    <SimpleCamera
      title="New Picture"
      leftIs="back"
      rightIs="next"
    />),
};

const imageScene = {
  id: 'edit-image-scene',
  renderContent: withNavigatorProps(
    <ApproveImageScene
      title=""
      leftIs="back"
      rightIs="return"
    />),
};

const routeLinks = {}

routeLinks[editListingScene.id] = {
  camera: {
    getRoute: () => cameraScene,
  },
  home: {
    title: 'Save',
  },
};

routeLinks[cameraScene.id] = {
  next: {
    title: '',
    getRoute: () => imageScene,
  },
};

routeLinks[imageScene.id] = {
  return: {
    title: 'Accept Photo',
    getRoute: () => editListingScene,
  },
};


module.exports.routeLinks = routeLinks;
module.exports.firstScene = editListingScene;
