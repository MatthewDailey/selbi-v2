import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';

import { mdl, MKButton, setTheme, MKTextField } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../../styles';
import RoutableScene from '../nav/RoutableScene';

export default class InputView extends RoutableScene {
  constructor(props) {
    super(props);
    this.state = { text: props.store.getState().get(props.field) };
  }

  renderWithNavBar() {
    console.log(`store:::: ${this.props.store.getState()}`)
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
              onTextChange={(newText) => {
                this.setState({ text: newText });
                this.props.store.dispatch(this.props.recordInputAction(newText));
              }}
              keyboardType={this.props.isNumeric ? 'numeric' : undefined}
            />
          </View>
        </View>
      </View>
    );
  }
};


export function EnterTitleView(props) {
  return <InputView {...props} inputTitle={'What are you selling?'} dataToStore={'title'} />;
}

export function EnterPriceView(props) {
  return <InputView {...props} inputTitle={'How much does it cost?'} dataToStore={'price'} />;
}
