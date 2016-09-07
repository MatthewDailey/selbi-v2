import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { listenToListingsByStatus } from '../firebase/FirebaseConnector';
import RoutableScene from '../nav/RoutableScene';
import ListingsComponent from '../components/ListingsListComponent';

import { setMyListingsInactive, setMyListingsPrivate, setMyListingsPublic, setMyListingsSold }
  from '../reducers/MyListingsReducer';

import styles from '../../styles';
import colors from '../../colors';

class MyListingsScene extends RoutableScene {
  componentWillMount() {
    listenToListingsByStatus('inactive', this.props.setInactiveListings);
    listenToListingsByStatus('public', this.props.setPublicListings);
    listenToListingsByStatus('private', this.props.setPrivateListings);
    listenToListingsByStatus('sold', this.props.setSoldListings);
  }

  renderWithNavBar() {
    return (
      <ScrollableTabView
        tabBarBackgroundColor={colors.primary}
        tabBarUnderlineColor={colors.secondary}
        tabBarActiveTextColor={colors.secondary}
        style={styles.fullScreenContainer}
      >
        <View tabLabel="Inactive" style={styles.fullScreenContainer}>
          <ListingsComponent
            listings={this.props.inactive}
            openSimpleScene={this.openSimpleScene}
          />
        </View>
        <View tabLabel="Public" style={styles.fullScreenContainer}>
          <ListingsComponent
            listings={this.props.public}
            openSimpleScene={this.openSimpleScene}
          />
        </View>
        <View tabLabel="Private" style={styles.fullScreenContainer}>
          <ListingsComponent
            listings={this.props.private}
            openSimpleScene={this.openSimpleScene}
          />
        </View>
        <View tabLabel="Sold" style={styles.fullScreenContainer}>
          <ListingsComponent
            listings={this.props.sold}
            openSimpleScene={this.openSimpleScene}
          />
        </View>
      </ScrollableTabView>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state.myListings)
  return {
    inactive: state.myListings.inactive,
    public: state.myListings.public,
    private: state.myListings.private,
    sold: state.myListings.sold,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setInactiveListings: (listings) => {
      dispatch(setMyListingsInactive(listings));
    },
    setPublicListings: (listings) => {
      console.log("called set public listings")
      dispatch(setMyListingsPublic(listings));
    },
    setPrivateListings: (listings) => {
      dispatch(setMyListingsPrivate(listings));
    },
    setSoldListings: (listings) => {
      dispatch(setMyListingsSold(listings));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyListingsScene);
