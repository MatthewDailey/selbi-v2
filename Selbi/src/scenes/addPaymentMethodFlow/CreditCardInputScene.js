import React from 'react';
import { connect } from 'react-redux';
import { Alert, View, Text } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import { CreditCardInput } from 'react-native-credit-card-input';

import { setCreditCard, AddCreditCardStatus } from '../../reducers/AddCreditCardReducer';

import { createPaymentSource } from '../../stripe/StripeConnector';
import { enqueueCreateCustomerRequest } from '../../firebase/FirebaseConnector';


import { paddingSize } from '../../../styles';
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
      createPaymentSource(
        this.props.creditCardData.values.number,
        this.props.creditCardData.values.expiry.substring(0, 2),
        this.props.creditCardData.values.expiry.substring(3, 5),
        this.props.creditCardData.values.cvc)
        .then((result) => {
          if (result.error) {
            return Promise.reject(result);
          }
          this.setState({ status: AddCreditCardStatus.creatingAccount });
          return enqueueCreateCustomerRequest(this.props.creditCardData.values.name, result);
        })
        .then(() => {
          this.setState({ status: AddCreditCardStatus.success });
          Alert.alert('Sucessfully added payment method.');
          this.goBack();
        })
        .catch((error) => {
          this.setState({ status: AddCreditCardStatus.failure });
          // TODO: Add more specific error based on failure type.
          Alert.alert('Failed to added payment method.');
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
        <SpinnerOverlay
          isVisible={this.state.status === AddCreditCardStatus.creatingAccount
            || this.state.status === AddCreditCardStatus.gettingKey}
          message="Creating payment method..."
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    creditCardData: state.addCreditCard,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCreditCardData: (data) => {
      dispatch(setCreditCard(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditCardInputScene);
