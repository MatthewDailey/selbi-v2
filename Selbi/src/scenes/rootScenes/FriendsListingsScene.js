import React from 'react';
import { connect } from 'react-redux';

import { loadFriendsListings } from '../../firebase/FirebaseConnector';
import RoutableScene from '../../nav/RoutableScene';
import ListingsListComponent from '../../components/ListingsListComponent';

import { setFriendsListings } from '../../reducers/FriendsListingsReducer';
import { clearNewListing } from '../../reducers/NewListingReducer';

class ListingsScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.fetchListings = this.fetchListings.bind(this);
  }

  componentWillMount() {
    this.fetchListings().catch(console.log);
  }

  fetchListings() {
    return loadFriendsListings().then(this.props.setListings);
  }

  onGoNext() {
    this.props.clearNewListingData();
  }

  renderWithNavBar() {
    return (
      <ListingsListComponent
        emptyMessage="None of your friends have a listing right now."
        listings={this.props.listings}
        refresh={this.fetchListings}
        openDetailScene={() => this.goNext('details')}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listings: state.friendsListings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setListings: (listings) => {
      dispatch(setFriendsListings(listings));
    },
    clearNewListingData: () => {
      dispatch(clearNewListing());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingsScene);
