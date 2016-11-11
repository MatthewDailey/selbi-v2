import React, { Component } from 'react';
import { Alert, View, Text } from 'react-native';

import FlatButton from '../components/buttons/FlatButton';

import { followUser, unfollowUser } from '../firebase/FirebaseConnector';

import styles from '../../styles';

export default class NewFriendListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      following: this.props.isFollower,
      modifying: false,
    };

    this.toggleFollowing = this.toggleFollowing.bind(this);
  }

  toggleFollowing() {
    if (this.state.following) {
      this.updateFollowing(unfollowUser, false);
    } else {
      this.updateFollowing(followUser, true);
    }
  }

  updateFollowing(userAction, isFollowing) {
    this.setState({ modifying: true }, () => {
      userAction(this.props.friendData.uid)
        .then(() => {
          this.setState({ following: isFollowing, modifying: false });
        })
        .catch((error) => {
          Alert.alert(error.message);
          this.setState({ following: false });
        });
    });
  }

  render() {
    return (
      <View
        style={
          [
            styles.halfPadded,
            { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
          ]
        }
      >
        <Text style={styles.buttonTextStyle}>
          {this.props.friendData.publicData.displayName}
        </Text>
        <FlatButton onPress={this.toggleFollowing}>
          <Text>{this.state.following ? 'Unfollow' : 'Follow'}</Text>
        </FlatButton>
      </View>
    );
  }
}

NewFriendListItem.propTypes = {
  friendData: React.PropTypes.shape({
    uid: React.PropTypes.string.isRequired,
    publicData: React.PropTypes.object.isRequired,
  }).isRequired,
};
