import React from 'react';
import { View, Text, Alert } from 'react-native';
import { MKTextField, MKButton } from 'react-native-material-kit';
import CreditCard from 'react-native-credit-card';

import styles from '../../styles';
import colors from '../../colors';
import RoutableScene from '../nav/RoutableScene';
import SpinnerOverlay from '../components/SpinnerOverlay';

const buttonViewStyle = {
  flex: 1,
  marginLeft: 10,
  marginRight: 10,
};

const Button = MKButton.button()
  .withStyle({
    borderRadius: 5,
  })
  .withBackgroundColor(colors.white)
  .withOnPress(() => Alert.alert('Sorry, not yet supported.'))
  .build();

export default class CreditCardInputScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.state = {
      type: '',
      focus: 'name',
      number: '',
      name: '',
      expiry: '',
      cvc: '',
    };
  }

  submitCreditCard() {
    Alert.alert('Not yet implemented.');
  }

  getForwardAndBackButtons(leftButtonName, onLeftButtonPress, rightButtonName, onRightButtonPress) {
    const leftButton = () => {
      if (leftButtonName) {
        return (
          <Button
            onPress={onLeftButtonPress}
          >
            <Text>{leftButtonName}</Text>
          </Button>
        );
      }
      return <View />;
    };

    const rightButton = () => {
      if (rightButtonName === undefined) {
        return <View />;
      }
      return (
        <Button
          onPress={onRightButtonPress}
        >
          <Text>{rightButtonName}</Text>
        </Button>
      );
    };

    return (
      <View style={{
        flex: 1,
        marginTop: 16,
        flexDirection: 'row',
      }}>
        <View style={buttonViewStyle}>
          {leftButton()}
        </View>
        <View style={buttonViewStyle}>
          {rightButton()}
        </View>
      </View>
    );
  }

  getTextInput() {
    switch (this.state.focus) {
      case 'number':
        return (
          <View>
            <MKTextField
              autoFocus
              floatingLabelEnabled
              onFocus={() => this.setState({ focus: 'number' })}
              placeholder={'Card Number'}
              style={{ height: 48 }}
              value={this.state.number}
              onTextChange={(newNumber) => this.setState({ number: newNumber})}
              returnKeyType="next"
              onSubmitEditing={() => this.setState({ focus: 'expiry' })}
            />
            {this.getForwardAndBackButtons(
              'Previous', () => this.setState({ focus: 'name' }),
              'Next', () => this.setState({ focus: 'expiry' }))}
          </View>
        );
      case 'expiry':
        return (
          <View>
            <MKTextField
              autoFocus
              floatingLabelEnabled
              onFocus={() => this.setState({ focus: 'expiry' })}
              placeholder={'Expiration Date'}
              style={{ height: 48 }}
              value={this.state.expiry}
              onTextChange={(newNumber) => this.setState({ expiry: newNumber})}
              keyboardType={'numeric'}
              returnKeyType="next"
              onSubmitEditing={() => this.setState({ focus: 'cvc' })}
            />
            {this.getForwardAndBackButtons(
              'Previous', () => this.setState({ focus: 'number' }),
              'Next', () => this.setState({ focus: 'cvc' }))}
          </View>
        );
      case 'cvc':
        return (
          <View>
            <MKTextField
              autoFocus
              floatingLabelEnabled
              onFocus={() => this.setState({ focus: 'cvc' })}
              placeholder={'CVC'}
              style={{ height: 48 }}
              value={this.state.cvc}
              onTextChange={(newNumber) => this.setState({ cvc: newNumber })}
              keyboardType={'numeric'}
              returnKeyType="done"
              onSubmitEditing={this.submitCreditCard}
            />
            {this.getForwardAndBackButtons(
              'Previous', () => this.setState({ focus: 'expiry' }),
              'Done', this.submitCreditCard)}
          </View>
        );
      case 'name':
      default:
        return (
          <View>
            <MKTextField
              autoFocus
              floatingLabelEnabled
              onFocus={() => this.setState({ focus: 'name' })}
              placeholder={'Card Holder Name'}
              style={{ height: 48 }}
              value={this.state.name}
              onTextChange={(newInput) => this.setState({ name: newInput })}
              returnKeyType="next"
              onSubmitEditing={() => this.setState({ focus: 'number' })}
            />
            {this.getForwardAndBackButtons(
              undefined, undefined,
              'Next', () => this.setState({ focus: 'number' }))}
          </View>
        );
    }
  }

  renderWithNavBar() {
    return (
      <View style={styles.paddedCenterContainer}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
        }}>
          <CreditCard
            type={this.state.type}
            shiny
            bar
            focused={this.state.focus}
            number={this.state.number}
            name={this.state.name}
            expiry={this.state.expiry}
            cvc={this.state.cvc}
          />
          <View style={styles.padded} />
          {this.getTextInput()}
        </View>
        <SpinnerOverlay message="One moment..." />
      </View>
    );
  }
}