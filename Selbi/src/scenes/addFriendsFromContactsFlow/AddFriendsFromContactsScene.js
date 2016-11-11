import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, View, Text, Alert } from 'react-native';

import { awaitPhoneVerification, followPhoneNumbers, updateBulletin, unfollowUser, followUser }
  from '../../firebase/FirebaseConnector';
import { normalizePhoneNumber, loadAllContactsPhoneNumber } from './utils';

import RoutableScene from '../../nav/RoutableScene';
import SpinnerOverlay from '../../components/SpinnerOverlay';
import FlatButton from '../../components/buttons/FlatButton';

import styles from '../../../styles';


function VerifiedCodeComponent({ followContacts }) {
  return (
    <View style={styles.paddedContainer}>
      <Text style={styles.friendlyTextLeft}>
        Successfully verified your phone!
      </Text>
      <View style={styles.halfPadded} />
      <Text style={styles.friendlyTextLeft}>
        Follow people in your contact book to see what your friends are selling.
      </Text>
      <View style={styles.halfPadded} />
      <FlatButton onPress={followContacts}>
        <Text>Follow Contacts</Text>
      </FlatButton>
    </View>
  );
}

class NewFriendListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      following: true,
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

function AddedFriendsComponent({ usersFollowed }) {
  console.log('Added friends: ', usersFollowed);
  const numFriends = usersFollowed.length;
  let friendsString = 'friends';
  if (numFriends === 1) {
    friendsString = 'friend';
  }
  return (
    <ScrollView>
      <View style={styles.paddedContainer}>
        <Text style={styles.friendlyTextLeft}>
          Added {numFriends} {friendsString} from your phone book.
        </Text>
        <View style={styles.halfPadded} />
        <Text style={styles.friendlyTextLeft}>
          Your contacts will also be able to follow you based on your phone number.
        </Text>
        <View style={styles.halfPadded} />
        <Text style={{ fontWeight: 'bold' }}>
          You are now following:
        </Text>
        {usersFollowed.map((userData) =>
          <NewFriendListItem key={userData.uid} friendData={userData} />)}
      </View>
    </ScrollView>
  );
}

function FailureComponent() {
  return (
    <View sylte={styles.paddedCenterContainer}>
      <Text style={styles.friendlyText}>
        There has been an error adding your contacts. Please try again later. 😭
      </Text>
    </View>
  );
}

class AddFriendsFromContactsScene extends RoutableScene {
  constructor(props) {
    super(props);
    this.addFriendsFromPhoneBook = this.addFriendsFromPhoneBook.bind(this);

    this.state = {
      view: <SpinnerOverlay isVisible message="Waiting for code verification..." />,
    };
  }

  addFriendsFromPhoneBook() {
    const success = (usersFollowed) => {
      this.setState({
        view: <AddedFriendsComponent usersFollowed={usersFollowed} />,
      });

      Object.keys(this.props.bulletins).forEach((key) => {
        if (this.props.bulletins[key].type === 'should-add-phone') {
          updateBulletin(key, { status: 'read' });
        }
      });
    };

    const error = (error) => this.setState({
      view: <FailureComponent />,
    });

    this.setState({
      view: <SpinnerOverlay message="Adding friends from contacts..." />,
    }, () => {
      loadAllContactsPhoneNumber()
        .then(followPhoneNumbers)
        .then(success)
        .catch(error);
    });
  }

  componentDidMount() {
    awaitPhoneVerification(normalizePhoneNumber(this.props.phoneNumber))
      .then(() => {
        this.setState({
          view: <VerifiedCodeComponent followContacts={this.addFriendsFromPhoneBook} />,
        });
      })
      .catch((error) => {
        this.setState({
          view: <FailureComponent message={`Failed to verified your phone. ${error}`} />,
        });
      });
  }

  renderWithNavBar() {
    return (
      <View style={styles.container}>
        {this.state.view}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    phoneNumber: state.addPhone.number,
    bulletins: state.bulletins,
  };
}

export default connect(
  mapStateToProps,
  undefined
)(AddFriendsFromContactsScene);
