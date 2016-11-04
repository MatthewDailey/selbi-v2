import React from 'react';
import { connect } from 'react-redux';

import { View, Text } from 'react-native';
import { MKButton } from 'react-native-material-kit';

import styles from '../../../styles';

import RoutableScene from '../../nav/RoutableScene';
import OpenSettingsComponent from '../../nav/OpenSettingsComponent';

import ListingsListComponent from '../../components/ListingsListComponent';
import BulletinBoard from '../../bulletin/BulletinBoard';

import { addLocalListing, removeLocalListing, clearLocalListings }
  from '../../reducers/LocalListingsReducer';
import { clearNewListing } from '../../reducers/NewListingReducer';

import { reportButtonPress } from '../../SelbiAnalytics';



function EmptyView({ openSell }) {
  const EmptySellButton = MKButton.button()
    .withOnPress(() => {
      this.props.refresh();
    })
    .build();

  return (
    <View>

      <Text style={styles.friendlyText}>No listings near you.</Text>
      <Text>Be the first to sell in your area!</Text>
      <View style={styles.halfPadded} />
      <EmptySellButton onPress={() => {
        reportButtonPress('local_listing_open_details');
        openSell();
      }}>
        <Text>Sell something</Text>
      </EmptySellButton>
      <View style={styles.padded} />
    </View>
  );
}

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
        emptyView={() => <EmptyView openSell={this.goNext} />}
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
