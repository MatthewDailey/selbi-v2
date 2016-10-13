import React from 'react';

import { View } from 'react-native';

import BulletinActionButton from './BulletinActionButton';
import ExpandingText from '../components/ExpandingText';

import bulletinStyles from './bulletinStyles';

export default function AddPhoneBulletin({ takeAction }) {
  return (
    <View>
      <ExpandingText style={bulletinStyles.bulletinText}>
        ☎️ Find out what your friends are selling by connecting your contact book.
      </ExpandingText>
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

