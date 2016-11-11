import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, View, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import FlatButton from '../../components/buttons/FlatButton';
import FacebookButton from '../../components/buttons/FacebookButton';
import VisibilityWrapper from '../../components/VisibilityWrapper';

import RoutableScene from '../../nav/RoutableScene';

import { linkWithFacebook, getUser } from '../../firebase/FirebaseConnector';

import styles from '../../../styles';

const noValue = 'N/A';

function BankInfoSettings({ bankInfo, onPress }) {
  const buttonText = bankInfo ? 'Update' : 'Add';

  return (
    <View style={styles.padded}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.friendlyTextLeft}>Bank Account</Text>
        <FlatButton onPress={onPress}>
          <Text>{buttonText}</Text>
        </FlatButton>
      </View>
      <VisibilityWrapper isVisible={!!bankInfo}>
        <Text>Bank: {bankInfo ? bankInfo.bankName : noValue}</Text>
        <Text>Last four of account: {bankInfo ? bankInfo.accountNumberLastFour : noValue}</Text>
      </VisibilityWrapper>

    </View>
  );
}
BankInfoSettings.propTypes = {
  bankInfo: React.PropTypes.object,
  onPress: React.PropTypes.func.isRequired,
};

function CreditCardInfoSettings({ creditCardInfo, onPress }) {
  const buttonText = creditCardInfo ? 'Update' : 'Add';
  return (
    <View style={styles.padded}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.friendlyTextLeft}>Credit Card</Text>
        <FlatButton onPress={onPress}>
          <Text>{buttonText}</Text>
        </FlatButton>
      </View>

      <VisibilityWrapper isVisible={!!creditCardInfo}>
        <Text>Card Type: {creditCardInfo ? creditCardInfo.cardBrand : noValue}</Text>
        <Text>Expiration: {creditCardInfo ? creditCardInfo.expirationDate : noValue}</Text>
        <Text>Last four of card: {creditCardInfo ? creditCardInfo.lastFour : noValue}</Text>
      </VisibilityWrapper>
    </View>
  );
}
CreditCardInfoSettings.propTypes = {
  creditCardInfo: React.PropTypes.object,
  onPress: React.PropTypes.func.isRequired,
};

function EmailSettings({ email, onPress }) {
  return (
    <View style={styles.padded}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.friendlyTextLeft}>Email</Text>
        <FlatButton onPress={onPress}>
          <Text>Update</Text>
        </FlatButton>
      </View>
      <Text>{email}</Text>
    </View>
  );
}
EmailSettings.propTypes = {
  email: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func.isRequired,
};

const GreenCheck = () => <Icon name="check-square-o" color="green" />;

function FacebookConnectionView() {
  const hasLinkedFacebook = getUser().providerData
    .map((provider) => provider.providerId === 'facebook.com')
    .reduce((a, b) => a || b, false);

  if (hasLinkedFacebook) {
    return (
      <Text><GreenCheck /> Facebook</Text>
    );
  }

  return (
    <FacebookButton
      onPress={() => linkWithFacebook().catch((error) => Alert.alert(error.message))}
      text="Connect with Facebook"
    />
  );
}

function ConnectedAccountsSettings() {
  return (
    <View style={styles.padded}>
      <Text style={styles.friendlyTextLeft}>Connected Accounts</Text>
      <FacebookConnectionView />
    </View>
  );
}

class SettingsScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <ScrollView>
        <EmailSettings
          email={this.props.email}
          onPress={() => this.goNext('email')}
        />
        <BankInfoSettings
          bankInfo={this.props.bankInfo}
          onPress={() => this.goNext('bank')}
        />
        <CreditCardInfoSettings
          creditCardInfo={this.props.creditCardInfo}
          onPress={() => this.goNext('creditCard')}
        />
        <ConnectedAccountsSettings />
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    bankInfo: state.userPrivate.merchant ? state.userPrivate.merchant.metadata : undefined,
    creditCardInfo: state.userPrivate.payment ? state.userPrivate.payment.metadata : undefined,
    email: state.userPrivate.email,
  };
}

export default connect(
  mapStateToProps,
  undefined
)(SettingsScene);