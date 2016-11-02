import React from 'react';
import { connect } from 'react-redux';

import RoutableScene from '../../nav/RoutableScene';
import OpenSettingsComponent from '../../nav/OpenSettingsComponent';

import ListingsListComponent from '../../components/ListingsListComponent';
import BulletinBoard from '../../bulletin/BulletinBoard';

import { addLocalListing, removeLocalListing, clearLocalListings }
  from '../../reducers/LocalListingsReducer';
import { clearNewListing } from '../../reducers/NewListingReducer';

import { reportButtonPress } from '../../SelbiAnalytics';

class ListingsScene extends RoutableScene {
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
        refresh={this.props.fetchLocalListings}
        listings={this.props.listings}
        emptyMessage="Be the first to post a listing in your area!"
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
