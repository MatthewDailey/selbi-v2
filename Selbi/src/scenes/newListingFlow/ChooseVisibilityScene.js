import React from 'react';
import { Alert, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import RoutableScene from '../../nav/RoutableScene';
import SpinnerOverlay from '../../components/SpinnerOverlay';

import { getGeolocation } from '../../utils';

import { setNewListingId, setNewListingLocation, setNewListingStatus, clearNewListing }
  from '../../reducers/NewListingReducer';

import { createNewListingFromStore, makeListingPrivate, makeListingPublic }
  from '../../firebase/FirebaseActions';

import styles from '../../../styles';
import colors from '../../../colors';

const Button = MKButton.button()
  .withStyle({
    borderRadius: 5,
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
    Alert.alert(`Failed to post listing. ${message}`);
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
            <Text><Icon name="users" size={16} />  My Friends</Text>
          </Button>
        </View>
        <View style={styles.halfPadded}>
          <Button
            onPress={
              () => {
                this.setState({ publishing: true })
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
            <Text><Icon name="globe" size={16} />  Anyone Nearby</Text>
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
