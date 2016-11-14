import React from 'react';
import { connect } from 'react-redux';

import { View, Text } from 'react-native';
import { MKButton } from 'react-native-material-kit';

import styles from '../../../styles';

import RoutableScene from '../../nav/RoutableScene';
import OpenSettingsComponent from '../../nav/OpenSettingsComponent';

import ListingsListComponent from '../../components/ListingsListComponent';
import BulletinBoard from '../../bulletin/BulletinBoard';
import FlatButton from '../../components/buttons/FlatButton';

import { addLocalListing, removeLocalListing, clearLocalListings }
  from '../../reducers/LocalListingsReducer';
import { clearNewListing } from '../../reducers/NewListingReducer';

import { reportButtonPress } from '../../SelbiAnalytics';

function EmptyView({ openSell }) {
  return (
    <View>
      <Text style={styles.friendlyText}>No listings near you.</Text>
      <Text>Be the first to sell in your area!</Text>
      <View style={styles.halfPadded} />
      <FlatButton
        onPress={() => {
          reportButtonPress('ll_open_details');
          openSell();
        }}
      >
        <Text>Sell something</Text>
      </FlatButton>
      <View style={styles.padded} />
    </View>
  );
}

EmptyView.propTypes = {
  openSell: React.PropTypes.func.isRequired,
};

class ListingsScene extends RoutableScene {
  onGoNext() {
    this.props.clearNewListingData();
  }

  renderWithNavBar() {
    if (this.props.locationPermissionDenied) {
      return (
        <OpenSettingsComponent
          missingPermissionDisplayString="location"
          missingPermission={['location']}
          onPermissionGranted={this.props.fetchLocalListings}
        />
      );
    }
    return (
      <ListingsListComponent
        header={<BulletinBoard goNext={this.goNext} />}
        refresh={this.props.fetchLocalListings}
        listings={this.props.listings}
        emptyMessage="Be the first to post a listing in your area!"
        emptyView={() => <EmptyView openSell={this.goNext} />}
        openDetailScene={() => {
          reportButtonPress('ll_open_details');
          this.goNext('details');
        }}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listings: state.localListings,
    locationPermissionDenied: state.permissions.location !== 'authorized',
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
