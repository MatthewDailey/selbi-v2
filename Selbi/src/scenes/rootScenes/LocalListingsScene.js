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


class ListingsScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.getGeolocation = this.getGeolocation.bind(this);
    this.fetchLocalListings = this.fetchLocalListings.bind(this);
    this.clearLocalListings = this.clearLocalListings.bind(this);
  }

  getGeolocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log(error);
          // Code: 1 = permission denied, 2 = unavailable, 3 = timeout.
          reject(error.message);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    });
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

    this.props.clearLocalListings();
  }

  fetchLocalListings() {
    clearNewListing();

    console.log('fetching local listings')
    return this.getGeolocation()
      .then((latlon) => {
        this.geoQuery =
          listenToListingsByLocation(
            latlon,
            20,
            this.props.addLocalListing,
            this.props.removeLocalListing);
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
