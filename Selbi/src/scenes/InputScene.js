import React from 'react';
import { View, Text, Alert } from 'react-native';
import { MKTextField } from 'react-native-material-kit';

import styles from '../../styles';
import RoutableScene from '../nav/RoutableScene';

export default class InputScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.onInputTextChange = this.onInputTextChange.bind(this);
  }

  shouldGoNext() {
    if (!this.props.inputValue) {
      Alert.alert('Must not be empty.');
      return false;
    } else if (this.props.isNumeric && isNaN(this.getInputValue(this.props.inputValue))) {
      Alert.alert('Must be a number.');
      return false;
    }
    return true;
  }

  getInputValue(newText) {
    if (this.props.isNumeric) {
      return parseFloat(newText);
    }
    return newText;
  }

  onInputTextChange(newText) {
    this.props.recordInput(this.getInputValue(newText));
  }

  renderWithNavBar() {
    return (
      <View style={styles.container}>
        <View style={styles.padded}>
          <Text style={styles.padded}>{this.props.inputTitle}</Text>
          <View style={styles.padded}>
            <MKTextField
              autoFocus
              floatingLabelEnabled={this.props.floatingLabel}
              placeholder={this.props.placeholder}
              style={{ height: 48 }}
              value={this.props.inputValue}
              onTextChange={this.onInputTextChange}
              keyboardType={this.props.isNumeric ? 'numeric' : undefined}
              returnKeyType="done"
              onSubmitEditing={this.goNext}
            />
          </View>
        </View>
      </View>
    );
  }
}

