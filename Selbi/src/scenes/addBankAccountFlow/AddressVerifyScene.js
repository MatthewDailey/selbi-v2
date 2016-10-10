import React from 'react';
import { connect } from 'react-redux'
import { InteractionManager, View, ScrollView, Text, Alert, TextInput } from 'react-native';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import styles from '../../../styles';
import RoutableScene from '../../nav/RoutableScene';

import { setAddressLine1, setAddressLine2, setAddressCity, setAddressPostal, setAddressState }
  from '../../reducers/AddBankAccountReducer';

const AddressInputLine = (props) =>
  <AutoGrowingTextInput
    autoFocus
    multiline
    style={{
      fontSize: 30,
    }}
    keyboardType={props.isNumeric ? 'numeric' : undefined}
    returnKeyType="done"
    {...props}
  />;

class AddressVerifyScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.state = { renderPlaceholderOnly: true };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false });
    });
  }

  shouldGoNext() {
    if (!this.props.line1) {
      Alert.alert('Address must have line 1.');
      return false;
    }
    if (!this.props.city) {
      Alert.alert('Address must have city.');
      return false;
    }
    if (!this.props.state) {
      Alert.alert('Address must have state.');
      return false;
    }
    if (!this.props.postal) {
      Alert.alert('Address must have postal code.');
      return false;
    }

    return true;
  }

  renderWithNavBar() {
    if (this.state.renderPlaceholderOnly) {
      return (
        <View style={styles.container} />
      );
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.padded}>
          <Text style={styles.friendlyTextLeft}>Is this address correct?</Text>
        </View>
        <View style={styles.padded}>
          <AddressInputLine
            placeholder="Line 1"
            value={this.props.line1}
            onChangeText={this.props.setLine1}
          />
          <AddressInputLine
            placeholder="Apt/Suite #"
            value={this.props.line2}
            onChangeText={this.props.setLine2}
          />
          <AddressInputLine
            placeholder="City"
            value={this.props.city}
            onChangeText={this.props.setCity}
          />
          <AddressInputLine
            placeholder="State"
            value={this.props.state}
            onChangeText={this.props.setState}
          />
          <AddressInputLine
            placeholder="Postal Code"
            value={this.props.postal}
            onChangeText={this.props.setPostalCode}
          />
        </View>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    line1: state.addBank.addressLine1,
    line2: state.addBank.addressLine2,
    city: state.addBank.addressCity,
    postal: state.addBank.addressPostalCode,
    state: state.addBank.addressState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLine1: (input) => dispatch(setAddressLine1(input)),
    setLine2: (input) => dispatch(setAddressLine2(input)),
    setCity: (input) => dispatch(setAddressCity(input)),
    setState: (input) => dispatch(setAddressState(input)),
    setPostalCode: (input) => dispatch(setAddressPostal(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddressVerifyScene);
