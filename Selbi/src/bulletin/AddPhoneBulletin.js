import React from 'react';

import { View } from 'react-native';

import BulletinActionButton from './BulletinActionButton';
import EmojiAlignedText from '../components/EmojiAlignedText';

import bulletinStyles from './bulletinStyles';

export default function AddPhoneBulletin({ takeAction }) {
  return (
    <View>
      <EmojiAlignedText emoji="☎️" style={bulletinStyles.bulletinText}>
        Find out what your friends are selling.
      </EmojiAlignedText>
      <BulletinActionButton
        text="Connect with contacts"
        onPress={takeAction}
      />
    </View>
  );
}

AddPhoneBulletin.propTypes = {
  takeAction: React.PropTypes.func.isRequired,
};

