import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import Permissions from 'react-native-permissions';
import TimerMixin from 'react-timer-mixin';

import { setPermissionsData } from '../reducers/PermissionsReducer';

import FlatButton from '../components/buttons/FlatButton';

import styles from '../../styles';

const TimerComponent = React.createClass({
  mixins: [TimerMixin],
  render: () => undefined,
});

class OpenSettingsComponent extends TimerComponent {
  componentDidMount() {
    this.setInterval(() => {
      Permissions.checkMultiplePermissions(['camera', 'photo', 'location'])
        .then((permissionStatus) => {
          this.props.storePermissions(permissionStatus);
          if (this.props.missingPermission
              && this.props.missingPermission
              .map((permission) => permissionStatus[permission] === 'authorized')
              .reduce((a, b) => a || b, false)) {
            this.props.onPermissionGranted(permissionStatus);
          }
        });
    }, 500);
  }

  render() {
    return (
      <View style={styles.paddedContainer}>
        <Text style={styles.friendlyTextLeft}>
          Selbi requires {this.props.missingPermissionDisplayString} permission.
        </Text>
        <View style={styles.padded} />
        <FlatButton onPress={Permissions.openSettings}>
          <Text>Open Settings</Text>
        </FlatButton>
      </View>
    );
  }
}

OpenSettingsComponent.propTypes = {
  missingPermissionDisplayString: React.PropTypes.string.isRequired,
  missingPermission: React.PropTypes.array,
  storePermissions: React.PropTypes.func.isRequired,
  onPermissionGranted: React.PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    storePermissions: (permissionsData) => dispatch(setPermissionsData(permissionsData)),
  };
}

export default connect(
  undefined,
  mapDispatchToProps
)(OpenSettingsComponent);
