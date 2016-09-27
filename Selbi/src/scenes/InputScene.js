import React from 'react';
import { InteractionManager, View, Text, Alert } from 'react-native';
import { MKTextField } from 'react-native-material-kit';

import { isStringFloat, isStringInt } from '../utils';
import styles from '../../styles';
import RoutableScene from '../nav/RoutableScene';

export default class InputScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onInputTextChange = this.onInputTextChange.bind(this);
    this.state = { renderPlaceholderOnly: true };
  }

  shouldGoNext() {
    if (!this.props.inputValue) {
      Alert.alert('Must not be empty.');
      return false;
    } else if (this.props.isNumeric && isNaN(this.parseInputValue(this.props.inputValue))) {
      Alert.alert('Must be a number.');
      return false;
    } else if (this.props.validateInputOnSubmit
        && !this.props.validateInputOnSubmit(this.props.inputValue)) {
      Alert.alert(this.props.validateFormatSuggestion);
      return false;
    }
    return true;
  }

  parseInputValue(newText) {
    if (this.props.isNumeric) {
      if (this.props.isInt && isStringInt(newText)) {
        return newText;
      } else if (!this.props.isInt && isStringFloat(newText)) {
        return newText;
      }
      return this.props.inputValue;
    }
    return newText;
  }

  onInputTextChange(newText) {
    this.props.recordInput(this.parseInputValue(newText));
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false });
    });
  }

  onSubmit() {
    this.goNext();
  }

  renderWithNavBar() {
    if (this.state.renderPlaceholderOnly) {
      return (
        <View style={styles.container} />
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.padded}>
          <View style={styles.padded}>
            <Text style={styles.friendlyTextLeft}>{this.props.inputTitle}</Text>
          </View>
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
              onSubmitEditing={this.onSubmit}
            />
          </View>
        </View>
      </View>
    );
  }
}

InputScene.defaultProps = {
  validateInputLive: () => true,
}

