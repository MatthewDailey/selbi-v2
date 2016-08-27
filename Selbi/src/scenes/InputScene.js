import React from 'react';
import { View, Text } from 'react-native';

import { MKTextField } from 'react-native-material-kit';

import styles from '../../styles';
import RoutableScene from '../nav/RoutableScene';

export default class InputView extends RoutableScene {
  constructor(props) {
    super(props);
    this.state = { text: props.store.getState().newListing.get(props.field) };
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
}

