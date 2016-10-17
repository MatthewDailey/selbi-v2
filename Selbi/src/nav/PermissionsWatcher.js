import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Permissions from 'react-native-permissions';

import { setPermissionsData } from '../reducers/PermissionsReducer';

class PermissionsWatcher extends Component {
  componentDidMount() {
    Permissions.checkMultiplePermissions(['camera', 'photo', 'location'])
      .then(this.props.storePermissions);
  }

  render() {
    return <View />;
  }
}

PermissionsWatcher.propTypes = {
  storePermissions: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    storePermissions: (permissionsData) => dispatch(setPermissionsData(permissionsData)),
  };
}

export default connect(
  undefined,
  mapDispatchToProps
)(PermissionsWatcher);
