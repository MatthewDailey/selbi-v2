import React from 'react';
import { connect } from 'react-redux';

import { } from '../../firebase/FirebaseConnector';
import RoutableScene from '../../nav/RoutableScene';
import ListingsListComponent from '../../components/ListingsListComponent';

import { setSellerProfileListings } from '../../reducers/SellerProfileReducer';

import { reportButtonPress } from '../../SelbiAnalytics';

class SellerProfileScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.fetchListings = this.fetchListings.bind(this);
  }

  componentWillMount() {
    this.fetchListings().catch(console.log);
  }

  fetchListings() {
    return Promise.resolve('Called fetch listings');
  }

  renderWithNavBar() {
    return (
      <ListingsListComponent
        emptyMessage="None of your friends have a listing for sale."
        listings={this.props.listings}
        refresh={this.fetchListings}
        openDetailScene={() => {
          reportButtonPress('friends_listings_open_detail');
          this.goNext('details');
        }}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sellerId: state.sellerProfile.uid,
    sellerData: state.sellerProfile.sellerData,
    listings: state.sellerProfile.listings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setListings: (listings) => {
      dispatch(setSellerProfileListings(listings));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SellerProfileScene);
