import React from 'react';

import { View } from 'react-native';

import BulletinActionButton from './BulletinActionButton';
import EmojiAlignedText from '../components/EmojiAlignedText';

import bulletinStyles from './bulletinStyles';

export default function AddBankAccountBulletin({ addBankAccount }) {
  return (
    <View>
      <EmojiAlignedText emoji="💰" style={bulletinStyles.bulletinText}>
        Get paid fast by setting up a way to receive payments.
      </EmojiAlignedText>
      <BulletinActionButton
        text="Connect bank account"
        onPress={addBankAccount}
      />
    </View>
  );
}

AddBankAccountBulletin.propTypes = {
  addBankAccount: React.PropTypes.func.isRequired,
};

