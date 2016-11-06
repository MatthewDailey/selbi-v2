import React from 'react';

import RoutableScene from '../../nav/RoutableScene';
import AskForPermissionComponent from './AskForPermissionComponent';

export default class RequestNotificationPermissionScene extends RoutableScene {
  render() {
    return <AskForPermissionComponent requestedPermission="notification" />;
  }
}

