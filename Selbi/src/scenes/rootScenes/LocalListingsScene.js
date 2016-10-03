import React from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, Alert, Text } from 'react-native';

import { listenToListingsByLocation } from '../../firebase/FirebaseConnector';
import RoutableScene from '../../nav/RoutableScene';

import ListingsListComponent from '../../components/ListingsListComponent';
import SellerInfoOverlay from '../../components/SellerInfoOverlay';

import { addLocalListing, removeLocalListing, clearLocalListings }
  from '../../reducers/LocalListingsReducer';
import { clearNewListing } from '../../reducers/NewListingReducer';

import { getGeolocation, watchGeolocation } from '../../utils';

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
  constructor(props) {
    super(props);

    this.fetchLocalListings = this.fetchLocalListings.bind(this);
    this.clearLocalListings = this.clearLocalListings.bind(this);
  }

  componentWillMount() {
    this.fetchLocalListings().catch(console.log);
  }

  componentWillUnmount() {
    this.clearLocalListings();
  }

  clearLocalListings() {
    if (this.geoQuery) {
      this.geoQuery.cancel();
    }

    if (this.cancelGeoWatch) {
      this.cancelGeoWatch();
    }

    this.props.clearLocalListings();
  }

  fetchLocalListings() {
    console.log('fetching local listings');

    clearNewListing();

    return getGeolocation()
      .then((location) => {
        this.geoQuery =
          listenToListingsByLocation(
            [location.lat, location.lon],
            20,
            this.props.addLocalListing,
            this.props.removeLocalListing);

        watchGeolocation((newLocation) => {
          if (this.geoQuery) {
            this.cancelGeoWatch = this.geoQuery.updateCriteria({
              center: [newLocation.lat, newLocation.lon],
            });
          }
        });
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(error);
      });
  }

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
            refresh={this.fetchLocalListings}
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
