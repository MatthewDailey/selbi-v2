import React from 'react';
import { View, Text } from 'react-native';

import FlatButton from '../../components/buttons/FlatButton';
import FacebookButton from '../../components/buttons/FacebookButton';

import RoutableScene from '../../nav/RoutableScene';

import styles from '../../../styles';

function BankInfoSettings({ openAddBank }) {
  return (
    <View style={styles.padded}>
      <Text style={styles.friendlyTextLeft}>Bank info</Text>
      <FlatButton onPress={openAddBank}>
        <Text>Update bank info</Text>
      </FlatButton>
    </View>
  );
}

function CreditCardInfoSettings() {
  return (
    <View style={styles.padded}>
      <Text style={styles.friendlyTextLeft}>Credit Card Info</Text>
      <FlatButton>
        <Text>Update credit card info</Text>
      </FlatButton>
    </View>
  );
}

function EmailSettings() {
  return (
    <View style={styles.padded}>
      <Text style={styles.friendlyTextLeft}>Email</Text>
      <FlatButton>
        <Text>Update Email</Text>
      </FlatButton>
    </View>
  );
}


function ConnectedAccountsSettings() {
  return (
    <View style={styles.padded}>
      <Text style={styles.friendlyTextLeft}>Connected Accounts</Text>
      <FacebookButton text="Connect with Facebook" />
    </View>
  );
}

export default class SettingsScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <View>
        <EmailSettings />
        <ConnectedAccountsSettings />
        <BankInfoSettings openAddBank={() => this.goNext('bank')} />
        <CreditCardInfoSettings />
      </View>
    );
  }
}

