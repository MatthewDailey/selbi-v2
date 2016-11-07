import React from 'react';

import { View } from 'react-native';

import BulletinActionButton from './BulletinActionButton';
import EmojiAlignedText from '../components/EmojiAlignedText';

import bulletinStyles from './bulletinStyles';

export default function AddPhoneBulletin({ takeAction }) {
  return (
    <View>
      <BulletinActionButton
        emoji="☎️"
        text="Connect with contacts"
        onPress={takeAction}
      />
    </View>
  );
}

AddPhoneBulletin.propTypes = {
  takeAction: React.PropTypes.func.isRequired,
};

