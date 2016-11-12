import React from 'react';
import { InteractionManager, View, Text, Alert, TextInput } from 'react-native';

import { isStringFloat, isStringInt } from '../utils';
import styles, { paddingSize } from '../../styles';
import colors from '../../colors';

import RoutableScene from '../nav/RoutableScene';

export default class InputScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onInputTextChange = this.onInputTextChange.bind(this);
    this.state = { renderPlaceholderOnly: true };
  }

  shouldGoNext() {
    if (!this.props.inputValue && this.props.allowEmpty) {
      return true;
    } else if (!this.props.inputValue) {
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
    if (this.props.isNumeric && !this.props.isNumericString) {
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

  onGoNext() {
    this.props.recordInput(this.props.inputValue);
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

    const InputTitle = () => {
      if (React.isValidElement(this.props.inputTitle)) {
        return <View>{this.props.inputTitle}</View>;
      }
      return <Text style={styles.friendlyTextLeft}>{this.props.inputTitle}</Text>;
    };

    return (
      <View style={styles.container}>
        <View style={styles.padded}>
          <View style={styles.padded}>
            <InputTitle />
          </View>
          <View style={{ paddingLeft: paddingSize, paddingRight: paddingSize }}>
            <TextInput
              autoFocus
              floatingLabelEnabled={this.props.floatingLabel}
              placeholder={this.props.placeholder}
              style={{
                color: colors.black,
                fontSize: 25,
                height: 40,
              }}
              value={this.props.inputValue}
              onChangeText={this.onInputTextChange}
              keyboardType={this.props.isNumeric ? 'numeric' : undefined}
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

