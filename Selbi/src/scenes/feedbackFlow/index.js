import React from 'react';
import { withNavigatorProps } from '../../nav/RoutableScene';

import FeedbackScene from './FeedbackScene';

const feedbackScene = {
  id: 'feedback_scene',
  renderContent: withNavigatorProps(
    <FeedbackScene
      title="Feedback"
      leftIs="back"
      rightIs="next"
    />),
};

const routeLinks = {};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = feedbackScene;
