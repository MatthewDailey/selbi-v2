import React from 'react';
import { connect } from 'react-redux';

import DeepLinkListener from './DeepLinkListener';
import { parseListingUrl } from './Utilities';

import { setListingKey } from '../reducers/ListingDetailReducer';

class OpenListingDeepLinkListener extends DeepLinkListener {

  isDetailSceneInStack() {
    let containsDetailScene = false;

    this.props.navigator.getCurrentRoutes().forEach((route) => {
      if (route.id === this.props.detailScene.id) {
        containsDetailScene = true;
      }
    });

    return containsDetailScene;
  }

  launchNewStackWithDetailScene(listingKey) {
    this.props.setDetailSceneListingKey(listingKey);
    this.props.navigator.immediatelyResetRouteStack(
      [this.props.rootScene, this.props.detailScene]);
  }

  popToDetailScene(listingKey) {
    this.props.navigator.popToRoute(this.props.detailScene);

    if (this.props.currentListingKey !== listingKey) {
      this.props.setDetailSceneListingKey(listingKey);
    }
  }

  handleOpenURL(event) {
    super.handleOpenURL(event);

    const listingKey = parseListingUrl(event.url);

    if (listingKey) {
      console.log('opening key: ', listingKey);

      if (this.isDetailSceneInStack()) {
        this.popToDetailScene(listingKey);
      } else {
        this.launchNewStackWithDetailScene(listingKey);
      }
    }
  }
}

OpenListingDeepLinkListener.propTypes = {
  detailScene: React.PropTypes.object.isRequired,
  rootScene: React.PropTypes.object.isRequired,
  currentListingKey: React.PropTypes.string,
  navigator: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    currentListingKey: state.listingDetails.listingKey,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDetailSceneListingKey: (listingKey) => dispatch(setListingKey(listingKey)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OpenListingDeepLinkListener);
