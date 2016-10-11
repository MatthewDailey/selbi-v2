import React from 'react';
import { connect } from 'react-redux';
import { Alert, View, Text, Image } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import { CreditCardInput } from 'react-native-credit-card-input';

import { setCreditCard, clearCreditCard, AddCreditCardStatus }
  from '../../reducers/AddCreditCardReducer';

import { createPaymentSource } from '../../stripe/StripeConnector';
import { enqueueCreateCustomerRequest } from '../../firebase/FirebaseConnector';

import styles, { paddingSize } from '../../../styles';
import colors from '../../../colors';
import RoutableScene from '../../nav/RoutableScene';
import VisibilityWrapper from '../../components/VisibilityWrapper';
import SpinnerOverlay from '../../components/SpinnerOverlay';

const Button = MKButton.button()
 .withStyle({
   borderRadius: 5,
   margin: paddingSize,
 })
  .withBackgroundColor(colors.white)
  .build();

class CreditCardInputScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.state = {
      status: AddCreditCardStatus.enteringData,
    };

    this.submit = this.submit.bind(this);
  }

  submit() {
    if (this.props.creditCardData.valid) {
      this.setState({ status: AddCreditCardStatus.gettingKey });
      console.log(this.props.creditCardData)
      createPaymentSource(
        this.props.creditCardData.values.get('number'),
        this.props.creditCardData.values.get('expiry').substring(0, 2),
        this.props.creditCardData.values.get('expiry').substring(3, 5),
        this.props.creditCardData.values.get('cvc'))
        .then((result) => {
          if (result.error) {
            return Promise.reject(result);
          }
          this.setState({ status: AddCreditCardStatus.creatingAccount });
          return enqueueCreateCustomerRequest(
            this.props.creditCardData.values.name,
            this.props.creditCardData.email,
            result);
        })
        .then(() => {
          this.setState({ status: AddCreditCardStatus.success });
          this.props.clearCreditCardData();
          Alert.alert('Sucessfully added payment method.');
          this.goReturn();
        })
        .catch((error) => {
          this.setState({ status: AddCreditCardStatus.failure });
          // TODO: Add more specific error based on failure type.
          Alert.alert(`Failed to added payment method. ${error.error.message}`);
          console.log(error);
        });
    } else {
      console.log('Failed to submit with cc data ', this.props.creditCardData);
      // TODO: Add more specific error based on failure type.
      Alert.alert('Double check all input values.');
    }
  }

  renderWithNavBar() {
    console.log(this.props.creditCardData.valid);

    return (
      <View style={{ paddingTop: paddingSize }}>
        <CreditCardInput
          autoFocus
          requiresName
          invalidColor={colors.accent}
          onChange={this.props.setCreditCardData}
        />
        <VisibilityWrapper isVisible={this.props.creditCardData.valid}>
          <Button onPress={this.submit}><Text>Submit</Text></Button>
        </VisibilityWrapper>
        <View style={[styles.halfPadded, styles.centerContainer]}>
          <Image source={require('../../../images/powered_by_stripe@3x.png')} />
        </View>
        <SpinnerOverlay
          isVisible={this.state.status === AddCreditCardStatus.creatingAccount
            || this.state.status === AddCreditCardStatus.gettingKey}
          message={`${this.state.status}...`}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    creditCardData: state.addCreditCard,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCreditCardData: (data) => dispatch(setCreditCard(data)),
    clearCreditCardData: () => dispatch(clearCreditCard()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditCardInputScene);
