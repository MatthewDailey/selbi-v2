import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, View } from 'react-native';

import BulletinActionButton from './BulletinActionButton';

import bulletinStyles, { notificationDescriptionFontSize } from './bulletinStyles';

export default function EmptyBulletinBoardBulletin({ goNext }) {
  return (
    <View>
      <Text style={bulletinStyles.bulletinText}>
        😇 You have no new notifications.
      </Text>
      <BulletinActionButton text="Sell something" onPress={() => goNext()} />
      <BulletinActionButton text="View all notifications" onPress={() => goNext('notifications')} />
      <View
        style={{
          paddingTop: 8,
          alignItems: 'center',
        }}
      >
        <Text style={bulletinStyles.actionButtonText}>
          <Icon name="arrow-down" size={notificationDescriptionFontSize} />
          {' Buy something '}
          <Icon name="arrow-down" size={notificationDescriptionFontSize} />
        </Text>
      </View>
    </View>
  );
}

EmptyBulletinBoardBulletin.propTypes = {
  goNext: React.PropTypes.func.isRequired,
};
