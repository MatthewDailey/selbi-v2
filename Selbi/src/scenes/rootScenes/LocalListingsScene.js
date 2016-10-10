import React from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, Text } from 'react-native';

import { MKSpinner } from 'react-native-material-kit';

import RoutableScene from '../../nav/RoutableScene';

import ListingsListComponent from '../../components/ListingsListComponent';
import BulletinBoard from '../../bulletin/BulletinBoard';

import { addLocalListing, removeLocalListing, clearLocalListings }
  from '../../reducers/LocalListingsReducer';
import { clearNewListing } from '../../reducers/NewListingReducer';




import styles from '../../../styles';
import colors from '../../../colors';

function EmptyView() {
  return (
    <View style={styles.paddedCenterContainerClear}>
      <Text style={styles.friendlyText}>Searching for listings near you...</Text>
      <MKSpinner strokeColor={colors.primary} />
    </View>
  );
}

class ListingsScene extends RoutableScene {

  onGoNext() {
    this.props.clearNewListingData();
  }

  renderWithNavBar() {
    return (
      <ScrollView>
        <BulletinBoard goNext={this.goNext} />
        <ListingsListComponent
          listings={this.props.listings}
          emptyView={EmptyView}
          openDetailScene={() => this.goNext('details')}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listings: state.localListings,
    hasLocationPermission: state.permissions.location === 'authorized',
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
