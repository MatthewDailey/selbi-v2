import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, View } from 'react-native';

import BulletinActionButton from './BulletinActionButton';

import bulletinStyles, { notificationDescriptionFontSize } from './bulletinStyles';

import { reportButtonPress } from '../SelbiAnalytics';

export default function EmptyBulletinBoardBulletin({ goNext }) {
  return (
    <View>
      <BulletinActionButton
        emoji="😇"
        text="You have no new notifications. Sell something!"
        onPress={() => {
          reportButtonPress('b_empty_sell');
          goNext();
        }}
      />
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
