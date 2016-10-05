import React from 'react';

import { View, Text } from 'react-native';

import BulletinActionButton from './BulletinActionButton';

import bulletinStyles from './bulletinStyles';

export default function NewFollowerBulletin() {
  return (
    <View>
      <Text ellipsizeMode="tail" numberOfLines={1} style={bulletinStyles.bulletinText}>
        😘 TJ (@tjpavlu) is now following you.
      </Text>
      <BulletinActionButton />
    </View>
  );
}
