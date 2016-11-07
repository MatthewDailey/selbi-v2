import React from 'react';

import { View } from 'react-native';

import BulletinActionButton from './BulletinActionButton';
import EmojiAlignedText from '../components/EmojiAlignedText';

import bulletinStyles from './bulletinStyles';

export default function AddBankAccountBulletin({ addBankAccount }) {
  return (
    <View>
      <BulletinActionButton
        emoji="💰"
        text="Connect a bank account"
        onPress={addBankAccount}
      />
    </View>
  );
}

AddBankAccountBulletin.propTypes = {
  addBankAccount: React.PropTypes.func.isRequired,
};

