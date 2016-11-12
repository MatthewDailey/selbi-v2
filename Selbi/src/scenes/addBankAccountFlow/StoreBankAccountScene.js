import React from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import RoutableScene from '../../nav/RoutableScene';
import VisibilityWrapper from '../../components/VisibilityWrapper';
import SpinnerOverlay from '../../components/SpinnerOverlay';
import FlatButton from '../../components/buttons/FlatButton';

import { stripeServiceAgreementScene } from '../legal';

import { createBankToken } from '../../stripe/StripeConnector';
import { enqueueCreateAccountRequest } from '../../firebase/FirebaseConnector';

import { setNewListingId, setNewListingLocation, setNewListingStatus, clearNewListing }
  from '../../reducers/NewListingReducer';

import { reportAddBankInfo, reportError } from '../../SelbiAnalytics';

import styles from '../../../styles';

const PublishStatus = {
  notStarted: 'not started',
  storingToStripe: 'Sending account data to Stripe...',
  storingToFirebase: 'Storing Stripe account info...',
  success: 'Success',
  failure: 'Failure',
};

class ChooseVisibilityScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.state = {
      publishStatus: PublishStatus.notStarted,
    };

    this.createAccount = this.createAccount.bind(this);
  }
  createAccount() {
    this.setState({ publishStatus: PublishStatus.storingToStripe });

    createBankToken(
      this.props.bankAccount.legalName,
      this.props.bankAccount.routingNumber,
      this.props.bankAccount.accountNumber)
      .then((bankTokenResponse) => {
        this.setState({ publishStatus: PublishStatus.storingToFirebase });

        const fullName = this.props.bankAccount.legalName;
        const firstName = fullName.substr(0, fullName.indexOf(' '));
        const lastName = fullName.substr(fullName.indexOf(' ') + 1);

        const address = {
          line1: this.props.bankAccount.addressLine1,
          city: this.props.bankAccount.addressCity,
          postal_code: this.props.bankAccount.addressPostalCode,
          state: this.props.bankAccount.addressState,
        };
        if (this.props.bankAccount.addressLine2) {
          address.line2 = this.props.bankAccount.addressLine2;
        }

        return enqueueCreateAccountRequest(
          bankTokenResponse.id,
          this.props.bankAccount.ssn,
          firstName,
          lastName,
          this.props.dob,
          address,
          this.props.bankAccount.email,
          bankTokenResponse.client_ip,
          bankTokenResponse.bank_account.last4,
          bankTokenResponse.bank_account.routing_number,
          bankTokenResponse.bank_account.bank_name);
      })
      .then((result) => {
        this.setState({ publishStatus: PublishStatus.success });
        reportAddBankInfo();
        console.log(result);
        Alert.alert('Successfully added the bank account!');
        this.goReturn();
      })
      .catch((error) => {
        this.setState({ publishStatus: PublishStatus.failure });
        reportError('add_bank', { error });
        console.log(error);
        Alert.alert('Error adding bank, check the data and try again.');
      });
  }

  renderWithNavBar() {
    return (
      <ScrollView>
        <View style={styles.paddedContainer}>
          <Text>
            <Text style={styles.labelTextLeft}>Account Owner: </Text>
            <Text style={styles.friendlyTextLeft}>{this.props.bankAccount.legalName}</Text>
          </Text>

          <View style={styles.halfPadded} />

          <Text>
            <Text style={styles.labelTextLeft}>SSN Last 4: </Text>
            <Text style={styles.friendlyTextLeft}>{this.props.bankAccount.ssn}</Text>
          </Text>

          <View style={styles.halfPadded} />

          <Text>
            <Text style={styles.labelTextLeft}>Date of birth: </Text>
            <Text style={styles.friendlyTextLeft}>
              {`${this.props.dob.month}/${this.props.dob.day}/${this.props.dob.year}`}
            </Text>
          </Text>

          <View style={styles.halfPadded} />

          <Text style={styles.labelTextLeft}>Address:</Text>
          <Text style={styles.friendlyTextLeft}>{this.props.bankAccount.addressLine1}</Text>
          <VisibilityWrapper isVisible={!!this.props.bankAccount.addressLine2}>
            <Text style={styles.friendlyTextLeft}>{this.props.bankAccount.addressLine2}</Text>
          </VisibilityWrapper>
          <Text style={styles.friendlyTextLeft}>
            {this.props.bankAccount.addressCity} {this.props.bankAccount.addressState}
          </Text>
          <Text style={styles.friendlyTextLeft}>{this.props.bankAccount.addressPostalCode}</Text>

          <View style={styles.halfPadded} />

          <Text>
            <Text style={styles.labelTextLeft}>Routing Number: </Text>
            <Text style={styles.friendlyTextLeft}>{this.props.bankAccount.routingNumber}</Text>
          </Text>

          <View style={styles.halfPadded} />

          <Text>
            <Text style={styles.labelTextLeft}>Account Number: </Text>
            <Text style={styles.friendlyTextLeft}>{this.props.bankAccount.accountNumber}</Text>
          </Text>

          <View style={styles.padded} />

          <Text>
            Selbi takes a 15% service fee on your sold items. Posting will always be free.
          </Text>

          <View style={styles.padded} />

          <FlatButton onPress={this.createAccount}>
            <Text><Icon name="university" /> Submit</Text>
          </FlatButton>

          <View style={styles.halfPadded} />

          <Text>
            {'By submitting your account information, you agree to the '}
            <Text
              style={{ textDecorationLine: 'underline' }}
              onPress={() => this.props.navigator.push(stripeServiceAgreementScene)}
            >
              Stripe Connected Account Agreement
            </Text>
            {'.'}
          </Text>

          <SpinnerOverlay
            isVisible={this.state.publishStatus === PublishStatus.storingToStripe
              || this.state.publishStatus === PublishStatus.storingToFirebase}
            message={this.state.publishStatus}
          />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    bankAccount: state.addBank,
    dob: {
      day: state.addBank.dob.getDate(),
      month: state.addBank.dob.getMonth() + 1,
      year: state.addBank.dob.getFullYear(),
    },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNewListingId: (id) => {
      dispatch(setNewListingId(id));
    },
    setNewListingLocation: (location) => {
      dispatch(setNewListingLocation(location));
    },
    clearNewListingData: () => dispatch(clearNewListing()),
    setListingStatus: (status) => dispatch(setNewListingStatus(status)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseVisibilityScene);
