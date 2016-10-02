import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, Alert } from 'react-native';

import { listenToListingsByLocation } from '../../firebase/FirebaseConnector';
import RoutableScene from '../../nav/RoutableScene';

import ListingsListComponent from '../../components/ListingsListComponent';
import SellerInfoOverlay from '../../components/SellerInfoOverlay';

import { addLocalListing, removeLocalListing, clearLocalListings }
  from '../../reducers/LocalListingsReducer';
import { clearNewListing } from '../../reducers/NewListingReducer';

import { getGeolocation, watchGeolocation } from '../../utils';

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
        <ListingsListComponent
          listings={this.props.listings}
          emptyMessage={'Be the first to sell in your neighborhood!'}
          refresh={this.fetchLocalListings}
          openDetailScene={() => this.goNext('details')}
        />
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
