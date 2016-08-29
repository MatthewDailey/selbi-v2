import React from 'react';
import { View, Text } from 'react-native';
import { MKSpinner, MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';


import styles from '../../styles';
import colors from '../../colors';
import RoutableScene from '../nav/RoutableScene';
import { createNewListingFromStore } from '../firebase/FirebaseActions';

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
  .withOnPress(() => alert('Sorry, not yet supported.'))
  .build();

function getPublishingView() {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.padded}>Updating your listing...</Text>
      <MKSpinner />
    </View>
  );
}

function getPublishedInactiveView() {
  return (
    <View style={styles.paddedContainer}>
      <Text style={styles.friendlyText}>We've posted your listing but it cannot yet be seen.</Text>
      <Text style={styles.friendlyText}>Who would you like to be able to see your listing?</Text>
      <View style={styles.halfPadded}>
        <Button>
          <Text><Icon name="users" size={16} />  My Friends</Text>
        </Button>
      </View>
      <View style={styles.halfPadded}>
        <Button>
          <Text><Icon name="globe" size={16} />  Anyone</Text>
        </Button>
      </View>
    </View>
  );
}

function getPublishedView(visibleTo) {
  return (
    <View style={styles.paddedContainer}>
      <Text style={styles.friendlyText}>{`Your listing is now visible to ${visibleTo}.`}</Text>
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

export default class PublishScene extends RoutableScene {
  constructor(props) {
    super(props);
    this.state = {
      status: publishStatus.publishing,
    };
  }

  componentDidMount() {
    createNewListingFromStore(this.props.store.getState().newListing)
      .then(() => {
        this.setState({
          status: publishStatus.publishedInactive,
        });
      })
      .catch(() => {
        this.setState({
          status: publishStatus.failure,
        });
      });
  }

  renderWithNavBar() {
    switch (this.state.status) {
      case publishStatus.publishing:
        return getPublishingView();
      case publishStatus.publishedInactive:
        return getPublishedInactiveView();
      case publishStatus.publishedPrivate:
        return getPublishedView('your friends');
      case publishStatus.publishedPublic:
        return getPublishedView('anyone nearby');
      case publishStatus.failure:
      default:
        return getPublishedView('anyone nearby');
    }
  }
}
