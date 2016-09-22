import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import RoutableScene from '../../nav/RoutableScene';

import { setNewListingId, setNewListingLocation, setNewListingStatus, clearNewListing }
  from '../../reducers/NewListingReducer';

import styles from '../../../styles';
import colors from '../../../colors';

const Button = MKButton.button()
  .withStyle({
    borderRadius: 5,
  })
  .withBackgroundColor(colors.white)
  .build();

class ChooseVisibilityScene extends RoutableScene {
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
          To sell faster, we recommend adding more details.
        </Text>
        <View style={styles.halfPadded}>
          <Button>
            <Text>Add Details</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  if (state.newListing.status === 'public') {
    return {
      visibleTo: 'anyone nearby',
    };
  }
  return {
    visibleTo: 'your friends',
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
)(ChooseVisibilityScene);
