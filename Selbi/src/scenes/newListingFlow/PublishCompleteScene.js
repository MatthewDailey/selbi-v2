import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';

import RoutableScene from '../../nav/RoutableScene';

import VisibilityWrapper from '../../components/VisibilityWrapper';

import { setNewListingId, setNewListingLocation, setNewListingStatus, clearNewListing }
  from '../../reducers/NewListingReducer';

import { getListingShareUrl } from '../../deeplinking/Utilities';

import styles from '../../../styles';
import colors from '../../../colors';

const Button = MKButton.button()
  .withStyle({
    borderRadius: 5,
  })
  .withBackgroundColor(colors.white)
  .build();

class PublishCompleteScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <View style={styles.paddedContainer}>
        <Text style={styles.friendlyText}>
          {`Your listing is visible and ready to sell to ${this.props.visibleTo}.`}
        </Text>
        <Text style={styles.friendlyText}>
          <Icon name="smile-o" size={30} />
        </Text>
        <Text style={styles.friendlyText}>
          To sell faster, we recommend adding more details and sharing with friends.
        </Text>
        <View style={styles.halfPadded}>
          <Button
            onPress={() => Share.open({ url: getListingShareUrl(this.props.listingKey) })
              .catch(console.log)}
          >
            <Text><Icon name="share-square-o" /> Share</Text>
          </Button>
        </View>
        <View style={styles.halfPadded}>
          <Button onPress={() => this.goNext()}>
            <Text><Icon name="list" /> Add Details</Text>
          </Button>
        </View>

        <VisibilityWrapper isVisible={!this.props.hasBankAccount}>
          <View>
            <Text style={styles.friendlyText}>
              You should link your bank account so that users can pay you easily through Selbi.
            </Text>
            <View style={styles.halfPadded}>
              <Button onPress={() => this.goNext('addBank')}>
                <Text><Icon name="university" /> Add Bank</Text>
              </Button>
            </View>
          </View>
        </VisibilityWrapper>
      </View>
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
