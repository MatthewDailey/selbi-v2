import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { MKButton } from 'react-native-material-kit';

import { } from '../../firebase/FirebaseConnector';
import RoutableScene from '../../nav/RoutableScene';
import ListingsListComponent from '../../components/ListingsListComponent';

import { setSellerProfileListings } from '../../reducers/SellerProfileReducer';

import colors from '../../../colors';
import styles from '../../../styles';

import { reportButtonPress } from '../../SelbiAnalytics';

const Button = MKButton.flatButton()
  .withStyle({
    borderRadius: 5,
    borderWidth: 1,
  })
  .withBackgroundColor(colors.white)
  .build();

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
      <View>
        <View style={[styles.padded, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Text style={styles.friendlyTextLeft}>{this.props.sellerData.displayName}</Text>
          <View style={styles.halfPadded} />
          <Button>
            <Text>Follow</Text>
          </Button>
        </View>

        <ScrollableTabView
          tabBarBackgroundColor={colors.secondary}
          tabBarUnderlineColor={colors.primary}
          tabBarActiveTextColor={colors.primary}
          style={styles.fullScreenContainer}
        >
          <View tabLabel="Public" style={styles.container}>
            <ListingsListComponent
              listings={this.props.listings}
              emptyMessage={`${this.props.sellerData.displayName} has no public listings.`}
              openDetailScene={() => {
                reportButtonPress('seller_profile_public_open_detail');
                this.goNext('details');
              }}
            />
          </View>
          <View tabLabel="Friends Only" style={styles.container}>
            <ListingsListComponent
              listings={this.props.listings}
              emptyMessage={`${this.props.sellerData.displayName} has no private listings.`}
              openDetailScene={() => {
                reportButtonPress('seller_profile_private_open_detail');
                this.goNext('details');
              }}
            />
          </View>
        </ScrollableTabView>
      </View>
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
