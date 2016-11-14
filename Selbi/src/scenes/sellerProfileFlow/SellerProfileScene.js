import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';

import { loadUserListingsByStatus, isFollowing, followUser, unfollowUser }
  from '../../firebase/FirebaseConnector';
import RoutableScene from '../../nav/RoutableScene';
import ListingsListComponent from '../../components/ListingsListComponent';
import FlatButton from '../../components/buttons/FlatButton';

import { setSellerProfilePrivateListings, setSellerProfilePublicListings, setIsFollowingSeller,
  clearSellerProfile } from '../../reducers/SellerProfileReducer';

import colors from '../../../colors';
import styles from '../../../styles';

import { reportButtonPress } from '../../SelbiAnalytics';

const GreenCheck = () => <Icon name="check-square-o" color="green" />;

class SellerProfileScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.fetchPrivateListings = this.fetchPrivateListings.bind(this);
    this.fetchPublicListings = this.fetchPublicListings.bind(this);
    this.checkIfFollowingSeller = this.checkIfFollowingSeller.bind(this);
  }

  componentWillMount() {
    this.fetchPrivateListings().catch(console.log);
    this.fetchPublicListings().catch(console.log);
    this.checkIfFollowingSeller().catch(console.log);
  }

  fetchPrivateListings() {
    return loadUserListingsByStatus(this.props.sellerId, 'private')
      .then(this.props.setPrivateListings);
  }

  fetchPublicListings() {
    return loadUserListingsByStatus(this.props.sellerId, 'public')
      .then(this.props.setPublicListings);
  }

  checkIfFollowingSeller() {
    return isFollowing(this.props.sellerId)
      .then(this.props.setIsFollowingSeller);
  }

  renderWithNavBar() {
    const SellerPrivateListings = () => {
      if (this.props.isFollowingSeller !== undefined && !this.props.isFollowingSeller) {
        return (
          <ListingsListComponent
            listings={{}}
            emptyMessage={`You are not following ${this.props.sellerData.displayName}.`}
          />
        );
      } else if (this.props.isFollowingSeller) {
        return (
          <ListingsListComponent
            listings={this.props.privateListings}
            emptyMessage={`${this.props.sellerData.displayName} has no private listings.`}
            openDetailScene={() => {
              reportButtonPress('sp_private_open_detail');
              this.goNext('details');
            }}
          />
        );
      }

      return (
        <ListingsListComponent
          listings={{}}
          emptyMessage="You must sign in to view private listings."
        />
      );
    };

    const FollowButton = () => {
      if (this.props.isFollowingSeller !== undefined && !this.props.isFollowingSeller) {
        return (
          <FlatButton
            onPress={() => followUser(this.props.sellerId).then(this.checkIfFollowingSeller)}
          >
            <Text>Follow</Text>
          </FlatButton>
        );
      } else if (this.props.isFollowingSeller) {
        return (
          <TouchableHighlight
            onPress={() => unfollowUser(this.props.sellerId).then(this.checkIfFollowingSeller)}
            underlayColor={colors.buttonHighlight}
          >
            <Text><GreenCheck /> Following</Text>
          </TouchableHighlight>
        );
      }
      return <View />;
    };

    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.padded, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Text style={styles.friendlyTextLeft}>{this.props.sellerData.displayName}</Text>
          <View style={styles.halfPadded} />
          <FollowButton />
        </View>

        <ScrollableTabView
          tabBarBackgroundColor={colors.secondary}
          tabBarUnderlineColor={colors.primary}
          tabBarActiveTextColor={colors.primary}
          style={styles.fullScreenContainer}
        >
          <View tabLabel="Public" style={styles.container}>
            <ListingsListComponent
              listings={this.props.publicListings}
              emptyMessage={`${this.props.sellerData.displayName} has no public listings.`}
              openDetailScene={() => {
                reportButtonPress('sp_public_open_detail');
                this.goNext('details');
              }}
            />
          </View>
          <View tabLabel="Followers Only" style={styles.container}>
            <SellerPrivateListings />
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
    isFollowingSeller: state.sellerProfile.isFollowingSeller,
    publicListings: state.sellerProfile.publicListings,
    privateListings: state.sellerProfile.privateListings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPublicListings: (listings) => {
      dispatch(setSellerProfilePublicListings(listings));
    },
    setPrivateListings: (listings) => {
      dispatch(setSellerProfilePrivateListings(listings));
    },
    setIsFollowingSeller: (isFollowingSeller) => {
      dispatch(setIsFollowingSeller(isFollowingSeller));
    },
    clearSellerProfile: () => dispatch(clearSellerProfile()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SellerProfileScene);
