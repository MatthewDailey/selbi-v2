import React from 'react';

import { Text, View } from 'react-native';

import BulletinActionButton from './BulletinActionButton';

import bulletinStyles from './bulletinStyles';

export default function EmptyBulletinBoardBulletin({ goNext }) {
  return (
    <View>
      <Text style={bulletinStyles.bulletinText}>
        😇 You have no new notifications.
      </Text>
      <BulletinActionButton text="Sell something" onPress={() => goNext()} />
      <BulletinActionButton text="View all notifications" onPress={() => goNext('notifications')} />
    </View>
  );
}

EmptyBulletinBoardBulletin.propTypes = {
  goNext: React.PropTypes.func.isRequired,
};
