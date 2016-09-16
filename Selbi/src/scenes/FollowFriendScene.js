import { connect } from 'react-redux';

import InputScene from './InputScene';
import { setPossibleFriendUsername } from '../reducers/FollowFriendReducer';

class FollowFriendScene extends InputScene {
  shouldGoReturn
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
