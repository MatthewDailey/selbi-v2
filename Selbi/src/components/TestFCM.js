import React, { Component } from 'react';
import { View, Text } from 'react-native';

import FCM from 'react-native-fcm';

export default class App extends Component {
  componentDidMount() {
    FCM.requestPermissions(); // for iOS
    FCM.getFCMToken().then(token => {
      console.log('------------FCM TOKEN---------------')
      console.log(token)
      // store fcm token in your server
    });
    this.notificationUnsubscribe = FCM.on('notification', (notif) => {
      console.log('remote notification')
      console.log(notif);
      // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
    });
    this.localNotificationUnsubscribe = FCM.on('localNotification', (notif) => {
      console.log('local notification')
      console.log(notif);
      // notif.notification contains the data
    });
    this.refreshUnsubscribe = FCM.on('refreshToken', (token) => {
      console.log(token)
      // fcm token may not be available on first load, catch it here
    });
  }

  componentWillUnmount() {
    // prevent leaking
    this.refreshUnsubscribe();
    this.notificationUnsubscribe();
    this.localNotificationUnsubscribe();
  }

  otherMethods(){
    FCM.subscribeToTopic('/topics/foo-bar');
    FCM.unsubscribeFromTopic('/topics/foo-bar');
    // FCM.getInitialNotification().then(...);

    // FCM.getScheduledLocalNotifications().then(...);
    FCM.cancelLocalNotification("UNIQ_ID_STRING");
    FCM.cancelAllLocalNotifications();
    FCM.setBadgeNumber();
    FCM.getBadgeNumber();
  }

  render() {
    return (
      <View>
        <Text>Testing FCM</Text>
      </View>
    );
  }
}
