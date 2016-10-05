import React from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, Alert, Text } from 'react-native';

import RoutableScene from '../../nav/RoutableScene';

import ListingsListComponent from '../../components/ListingsListComponent';
import SellerInfoOverlay from '../../bulletin/SellerInfoOverlay';

import { addLocalListing, removeLocalListing, clearLocalListings }
  from '../../reducers/LocalListingsReducer';
import { clearNewListing } from '../../reducers/NewListingReducer';


import { MKSpinner } from 'react-native-material-kit';

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
        <SellerInfoOverlay />
        <View>
          <ListingsListComponent
            listings={this.props.listings}
            emptyView={EmptyView}
            openDetailScene={() => this.goNext('details')}
          />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listings: state.localListings,
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
