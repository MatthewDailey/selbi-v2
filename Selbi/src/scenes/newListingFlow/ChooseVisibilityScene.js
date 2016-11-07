import React from 'react';
import { Alert, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import Permissions from 'react-native-permissions';
import flattenStyle from 'flattenStyle';

import RoutableScene from '../../nav/RoutableScene';
import SpinnerOverlay from '../../components/SpinnerOverlay';

import { getGeolocation } from '../../utils';

import { setNewListingId, setNewListingLocation, setNewListingStatus, clearNewListing }
  from '../../reducers/NewListingReducer';

import { createNewListingFromStore, makeListingPrivate, makeListingPublic }
  from '../../firebase/FirebaseActions';

import styles from '../../../styles';
import colors from '../../../colors';

import { reportButtonPress } from '../../SelbiAnalytics';

const Button = MKButton.flatButton()
  .withStyle({
    borderRadius: 5,
    borderWidth: 1,
  })
  .withBackgroundColor(colors.white)
  .build();

class ChooseVisibilityScene extends RoutableScene {
  constructor(props) {
    super(props);
    this.state = {
      publishing: false,
    };

    this.handleError = this.handleError.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
  }

  handleError(message) {
    this.setState({ publishing: false });
    console.log(message);

    if (message === 'location permission error') {
      Alert.alert(
        'Can we access your location?',
        'We need access to show your listing to nearby buyers.',
        [
          { text: 'Cancel', onPress: () => console.log('permission denied'), style: 'cancel' },
          { text: 'Open Settings', onPress: Permissions.openSettings },
        ]
      );
    } else {
      Alert.alert(`Failed to post listing. ${message}`);
    }
  }

  handleSuccess() {
    this.setState({ publishing: false });
    this.goNext();
  }

  renderWithNavBar() {
    return (
      <View style={styles.paddedContainer}>
        <Text style={styles.friendlyText}>Who would you like to be able to see your listing?</Text>
        <View style={styles.halfPadded}>
          <Button
            onPress={
              () => {
                reportButtonPress('choose_visibility_private');
                this.setState({ publishing: true })
                createNewListingFromStore(this.props.newListing)
                  .then((newListingId) => {
                    this.props.setNewListingId(newListingId);
                  })
                  .then(() => makeListingPrivate(this.props.newListing))
                  .then(() => {
                    this.props.setListingStatus('private');
                  })
                  .then(this.handleSuccess)
                  .catch(this.handleError);
              }
            }
          >
            <Text style={styles.buttonTextStyle}>
              <Icon name="users" size={flattenStyle(styles.buttonTextStyle).fontSize} />  My Friends
            </Text>
          </Button>
        </View>
        <View style={styles.halfPadded}>
          <Button
            onPress={
              () => {
                reportButtonPress('choose_visibility_public');
                this.setState({ publishing: true });
                createNewListingFromStore(this.props.newListing)
                  .then((newListingId) => {
                    this.props.setNewListingId(newListingId);
                  })
                  .then(getGeolocation)
                  .then(this.props.setNewListingLocation)
                  .then(() => makeListingPublic(this.props.newListing))
                  .then(() => {
                    this.props.setListingStatus('public');
                  })
                  .then(this.handleSuccess)
                  .catch(this.handleError);
              }
            }
          >
            <Text style={styles.buttonTextStyle}>
              <Icon name="globe" size={flattenStyle(styles.buttonTextStyle).fontSize} />  Anyone Nearby
            </Text>
          </Button>
        </View>
        <SpinnerOverlay isVisible={this.state.publishing} />
      </View>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    newListing: state.newListing,
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
