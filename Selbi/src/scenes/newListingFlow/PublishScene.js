import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { MKSpinner, MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import { setNewListingId, setNewListingLocation, setNewListingStatus, clearNewListing }
  from '../../reducers/NewListingReducer';


import styles from '../../../styles';
import colors from '../../../colors';
import RoutableScene from '../../nav/RoutableScene';
import { createNewListingFromStore, makeListingPrivate, makeListingPublic }
from '../../firebase/FirebaseActions';

const publishStatus = {
  publishing: 'publishing',
  publishedInactive: 'publishedInactive',
  publishedPrivate: 'publishedPrivate',
  publishedPublic: 'publishedPublic',
  failure: 'failure',
};

const Button = MKButton.button()
  .withStyle({
    borderRadius: 5,
  })
  .withBackgroundColor(colors.white)
  .build();

function getPublishingView() {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.padded}>Updating your listing...</Text>
      <MKSpinner strokeColor={colors.primary} />
    </View>
  );
}

function getPublishedView(visibleTo) {
  return (
    <View style={styles.paddedContainer}>
      <Text style={styles.friendlyText}>
        {`Your listing is visible and ready to sell to ${visibleTo}.`}
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

function getFailureView() {
  return (
    <View style={styles.paddedContainer}>
      <Text style={styles.friendlyText}>
        Unfortunately we've messed something up and you'll have to try making your listing again.
      </Text>
      <Text style={styles.friendlyText}>
        <Icon name="frown-o" size={30} />
      </Text>
    </View>
  );
}

class PublishScene extends RoutableScene {
  constructor(props) {
    super(props);
    this.state = {
      status: publishStatus.publishing,
    };

    this.handleError = this.handleError.bind(this);
  }

  handleError(error) {
    console.log(error);
    this.setState({ status: publishStatus.failure });
  }

  getGeolocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.props.setNewListingLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          resolve();
        },
        (error) => {
          // Code: 1 = permission denied, 2 = unavailable, 3 = timeout.
          reject(error.message);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    });
  }

  onGoHome() {
    this.props.clearNewListingData();
  }

  getPublishedInactiveView() {
    return (
      <View style={styles.paddedContainer}>
        <Text style={styles.friendlyText}>We've got your listing but it cannot yet be seen.</Text>
        <Text style={styles.friendlyText}>Who would you like to be able to see your listing?</Text>
        <View style={styles.halfPadded}>
          <Button
            onPress={
              () => this.setState({ status: publishStatus.publishing },
                () => makeListingPrivate(this.props.newListing)
                  .then(() => {
                    this.setState({ status: publishStatus.publishedPrivate })
                    this.props.setListingStatus('private');
                  })
                  .catch(this.handleError))
            }
          >
            <Text><Icon name="users" size={16} />  My Friends</Text>
          </Button>
        </View>
        <View style={styles.halfPadded}>
          <Button
            onPress={
              () => this.setState({ status: publishStatus.publishing },
                () => this.getGeolocation()
                  .then(() => makeListingPublic(this.props.newListing))
                  .then(() => {
                    this.setState({ status: publishStatus.publishedPublic });
                    this.props.setListingStatus('public');
                  })
                  .catch(this.handleError))
            }
          >
            <Text><Icon name="globe" size={16} />  Anyone</Text>
          </Button>
        </View>
      </View>
    );
  }

  componentDidMount() {
    console.log(this.props.newListing)
    createNewListingFromStore(this.props.newListing)
      .then((newListingId) => {
        this.props.setNewListingId(newListingId);
        this.setState({
          status: publishStatus.publishedInactive,
        });
      })
      .catch(this.handleError);
  }

  renderWithNavBar() {
    switch (this.state.status) {
      case publishStatus.publishing:
        return getPublishingView();
      case publishStatus.publishedInactive:
        return this.getPublishedInactiveView();
      case publishStatus.publishedPrivate:
        return getPublishedView('your friends');
      case publishStatus.publishedPublic:
        return getPublishedView('anyone nearby');
      case publishStatus.failure:
      default:
        return getFailureView();
    }
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
)(PublishScene);
