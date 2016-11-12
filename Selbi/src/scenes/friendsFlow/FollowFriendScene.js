import React from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';

import InputScene from '../InputScene';
import SpinnerOverlay from '../../components/SpinnerOverlay';

import { setPossibleFriendUsername } from '../../reducers/FollowFriendReducer';
import { addFriendByUsername } from '../../firebase/FirebaseConnector';

import styles from '../../../styles';

class FollowFriendScene extends InputScene {
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
    };
  }

  getUsernameFromInput() {
    return this.props.inputValue.toLowerCase().trim().replace(/^@/gm, '');
  }

  onSubmit() {
    this.goReturn();
  }

  shouldGoReturn() {
    if (!this.props.inputValue) {
      Alert.alert('Friend username input must not be empty.');
    } else if (!this.state.saving) {
      this.setState({
        saving: true,
      });

      addFriendByUsername(this.getUsernameFromInput())
        .then(() => {
          Alert.alert(`Added \'${this.props.inputValue}\' as a friend.`);
          this.props.navigator.pop();
        })
        .catch(() => {
          Alert.alert(`Unable to add \'${this.props.inputValue}\' as a friend.`);
          this.setState({
            saving: false,
          });
        });
    }
    return false;
  }

  renderWithNavBar() {
    const inputView = super.renderWithNavBar();

    return (
      <View style={styles.container}>
        {inputView}
        <SpinnerOverlay isVisible={this.state.saving} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    inputValue: state.followFriend.username,
    inputTitle: "What's your friend's username?",
    placeholder: "Eg. '@bestfriend'",
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recordInput: (value) => {
      dispatch(setPossibleFriendUsername(value));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowFriendScene);
