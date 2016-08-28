import React from 'react';
import { View, Text, Alert } from 'react-native';
import { MKTextField } from 'react-native-material-kit';

import styles from '../../styles';
import RoutableScene from '../nav/RoutableScene';

export default class InputScene extends RoutableScene {
  constructor(props) {
    super(props);
    this.state = { text: this.props.loadInitialInput() };

    this.onInputTextChange = this.onInputTextChange.bind(this);
  }

  shouldGoNext() {
    if (!this.state.text) {
      Alert.alert('Must not be empty.');
      return false;
    } else if (this.props.isNumeric && isNaN(this.getInputValue())) {
      Alert.alert('Must be a number.');
      return false;
    }
    return true;
  }

  getInputValue() {
    if (this.props.isNumeric) {
      return parseFloat(this.state.text);
    }
    return this.state.text;
  }

  onInputTextChange(newText) {
    this.setState({ text: newText },
      () => this.props.store.dispatch(this.props.recordInputAction(this.getInputValue()))
    );
  }

  renderWithNavBar() {
    return (
      <View style={styles.container}>
        <View style={styles.padded}>
          <Text style={styles.padded}>{this.props.inputTitle}</Text>
          <View style={styles.padded}>
            <MKTextField
              floatingLabelEnabled={this.props.floatingLabel}
              placeholder={this.props.placeholder}
              style={{ height: 48 }}
              value={this.state.text}
              onTextChange={this.onInputTextChange}
              keyboardType={this.props.isNumeric ? 'numeric' : undefined}
            />
          </View>
        </View>
      </View>
    );
  }
}

