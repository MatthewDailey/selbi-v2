import React from 'react';
import { connect } from 'react-redux';
import { RefreshControl } from 'react-native';

import RoutableScene from '../../nav/RoutableScene';
import OpenSettingsComponent from '../../nav/OpenSettingsComponent';

import ListingsListComponent from '../../components/ListingsListComponent';
import BulletinBoard from '../../bulletin/BulletinBoard';

import { addLocalListing, removeLocalListing, clearLocalListings }
  from '../../reducers/LocalListingsReducer';
import { clearNewListing } from '../../reducers/NewListingReducer';

import { reportButtonPress } from '../../SelbiAnalytics';

class ListingsScene extends RoutableScene {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };

    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.props.fetchLocalListings()
      .then(() => {
        this.setState({ refreshing: false });
      });
  }

  onGoNext() {
    this.props.clearNewListingData();
  }

  renderWithNavBar() {
    if (this.props.locationPermissionDenied) {
      return <OpenSettingsComponent missingPermission="location" />;
    }
    return (
      <ListingsListComponent
        header={<BulletinBoard goNext={this.goNext} />}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        refresh={this.props.fetchLocalListings}
        listings={this.props.listings}
        emptyMessage="No listings found in your area."
        openDetailScene={() => {
          reportButtonPress('local_listing_open_details');
          this.goNext('details');
        }}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listings: state.localListings,
    locationPermissionDenied: state.permissions.location === 'denied',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addLocalListing: (newListing) => dispatch(addLocalListing(newListing)),
    removeLocalListing: (listingId) => dispatch(removeLocalListing(listingId)),
    clearLocalListings: () => dispatch(clearLocalListings()),
    clearNewListingData: () => dispatch(clearNewListing()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingsScene);
