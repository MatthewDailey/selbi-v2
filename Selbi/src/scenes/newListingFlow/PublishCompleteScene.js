import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';

import RoutableScene from '../../nav/RoutableScene';
import FlatButton from '../../components/buttons/FlatButton';
import VisibilityWrapper from '../../components/VisibilityWrapper';

import { setNewListingId, setNewListingLocation, setNewListingStatus, clearNewListing }
  from '../../reducers/NewListingReducer';

import { getListingShareUrl } from '../../deeplinking/Utilities';

import styles from '../../../styles';
import { reportButtonPress, reportShare } from '../../SelbiAnalytics';

const buttonTextStyle = {
  fontSize: 20,
};

class PublishCompleteScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <ScrollView style={styles.paddedContainer}>
        <Text style={styles.friendlyText}>
          {`Your listing is visible and ready to sell to ${this.props.visibleTo}.`}
        </Text>
        <Text style={styles.friendlyText}>
          <Icon name="smile-o" size={30} />
        </Text>
        <View style={styles.halfPadded}>
          <FlatButton
            onPress={() => {
              reportButtonPress('publish_complete_share');
              reportShare(this.props.listingKey);
              Share.open({ url: getListingShareUrl(this.props.listingKey) })
                .catch(console.log);
            }}
          >
            <Text style={buttonTextStyle}>
              <Icon name="share-square-o" size={buttonTextStyle.fontSize} /> Share
            </Text>
          </FlatButton>
        </View>
        <View style={styles.halfPadded}>
          <FlatButton
            onPress={() => {
              reportButtonPress('publish_complete_add_details');
              this.goNext();
            }}
          >
            <Text style={buttonTextStyle}>
              <Icon name="list" size={buttonTextStyle.fontSize} /> Add Details
            </Text>
          </FlatButton>
        </View>

        <VisibilityWrapper isVisible={!this.props.hasBankAccount}>
          <View>
            <View style={styles.halfPadded}>
              <FlatButton
                onPress={() => {
                  reportButtonPress('publish_complete_add_bank');
                  this.goNext('addBank');
                }}
              >
                <Text style={buttonTextStyle}>
                  <Icon name="university" size={buttonTextStyle.fontSize} /> Receive Payments
                </Text>
              </FlatButton>
            </View>
            <View style={styles.centerContainer}>
              <Image source={require('../../../images/powered_by_stripe@3x.png')} />
            </View>
          </View>
        </VisibilityWrapper>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  let visibleTo = 'your friends';
  if (state.newListing.status === 'public') {
    visibleTo = 'anyone nearby';
  }
  return {
    visibleTo,
    listingKey: state.newListing.listingId,
    hasBankAccount: state.user.hasBankAccount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNewListingId: (id) => {
      dispatch(setNewListingId(id));
    },
    setNewListingLocation: (location) => {
      dispatch(setNewListingLocation(location));
    },
    clearNewListingData: () => dispatch(clearNewListing()),
    setListingStatus: (status) => dispatch(setNewListingStatus(status)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishCompleteScene);
