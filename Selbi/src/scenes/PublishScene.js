import React from 'react';
import { View, Text } from 'react-native';
import { MKSpinner } from 'react-native-material-kit';

import styles from '../../styles';
import RoutableScene from '../nav/RoutableScene';
import { createNewListingFromStore } from '../firebase/FirebaseActions';

const publishStatus = {
  publishing: 'publishing',
  publishedInactive: 'publishedInactive',
  publishedPrivate: 'publishedPrivate',
  publishedPublic: 'publishedPublic',
  failure: 'failure',
};

function getPublishingView() {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.padded}>Updating your listing...</Text>
      <MKSpinner />
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
        // this.setState({
        //   status: publishStatus.failure,
        // });
      });
  }

  renderWithNavBar() {
    if (this.state.status === publishStatus.publishing) {
      return getPublishingView();
    }
    return (
      <View style={styles.container}>
        <Text>Successfully posted.</Text>
        <Text>Get ready to get paid!</Text>
      </View>
    );
  }
}
