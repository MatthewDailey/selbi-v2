import React from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, Text, RefreshControl } from 'react-native';

// noinspection Eslint - Dimensions provided by react-native env.
import Dimensions from 'Dimensions';

import { MKSpinner } from 'react-native-material-kit';

import RoutableScene from '../../nav/RoutableScene';
import OpenSettingsComponent from '../../nav/OpenSettingsComponent';

import ListingsListComponent from '../../components/ListingsListComponent';
import BulletinBoard from '../../bulletin/BulletinBoard';

import { addLocalListing, removeLocalListing, clearLocalListings }
  from '../../reducers/LocalListingsReducer';
import { clearNewListing } from '../../reducers/NewListingReducer';

import styles from '../../../styles';
import colors from '../../../colors';
import { reportButtonPress } from '../../SelbiAnalytics';

function EmptyView() {
  return (
    <View style={styles.paddedCenterContainerClear}>
      <Text style={styles.friendlyText}>Searching for listings near you...</Text>
      <MKSpinner strokeColor={colors.primary} />
    </View>
  );
}

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

  getLocalListingsView() {
    if (this.props.locationPermissionDenied) {
      return <OpenSettingsComponent missingPermission="location" />;
    }

    const { width } = Dimensions.get('window');

    return (
      <ListingsListComponent
        header={
          <View style={{ width }}>
            <BulletinBoard goNext={this.goNext} />
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        listings={this.props.listings}
        emptyView={EmptyView}
        openDetailScene={() => {
          reportButtonPress('local_listing_open_details');
          this.goNext('details');
        }}
      />
    );
  }

  renderWithNavBar() {
    console.log('Rendering LocalListingsScene');
    return this.getLocalListingsView();
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
