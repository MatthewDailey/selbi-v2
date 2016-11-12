import React from 'react';
import { withNavigatorProps } from '../../nav/RoutableScene';

import FeedbackScene from './FeedbackScene';
import CompletedFeedbackScene from './CompletedFeedbackScene';

const feedbackScene = {
  id: 'feedback_s',
  renderContent: withNavigatorProps(
    <FeedbackScene
      title="Feedback"
      leftIs="back"
      rightIs="next"
    />),
};

const completedFeedbackScene = {
  id: 'completed_feedback_s',
  renderContent: withNavigatorProps(
    <CompletedFeedbackScene
      rightIs="home"
    />
  ),
};


const routeLinks = {};

routeLinks[feedbackScene.id] = {
  next: {
    title: 'Submit',
    getRoute: () => completedFeedbackScene,
  },
};

routeLinks[completedFeedbackScene.id] = {
  home: {
    title: 'Done',
  },
};

module.exports.routeLinks = routeLinks;
module.exports.firstScene = feedbackScene;
