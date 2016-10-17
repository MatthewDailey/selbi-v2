import React from 'react';
import { connect } from 'react-redux';
import { TouchableHighlight, View, Text } from 'react-native';
import Permissions from 'react-native-permissions';
import TimerMixin from 'react-timer-mixin';

import { setPermissionsData } from '../reducers/PermissionsReducer';

import styles from '../../styles';

const TimerComponent = React.createClass({
  mixins: [TimerMixin],
  render: () => undefined,
});

class OpenSettingsComponent extends TimerComponent {
  componentDidMount() {
    this.setInterval(() => {
      Permissions.checkMultiplePermissions(['camera', 'photo', 'location'])
        .then(this.props.storePermissions);
    }, 500);
  }

  render() {
    return (
      <TouchableHighlight onPress={Permissions.openSettings}>
        <View style={styles.paddedContainer}>
          <Text style={styles.friendlyText}>
            Selbi requires {this.props.missingPermission} permission.
          </Text>
          <View style={styles.padded} />
          <Text style={styles.friendlyText}>Tap to open settings.</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

OpenSettingsComponent.propTypes = {
  missingPermission: React.PropTypes.string.isRequired,
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
)(OpenSettingsComponent);
