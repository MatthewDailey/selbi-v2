import React, { Component } from 'react';
import { View, Text } from 'react-native';

const style = {
  backgroundColor: 'white',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

export class EnterDetailsView extends Component {
  render() {
    return (
      <View style={style}>
        <Text>Enter Details</Text>
      </View>
    );
  }
}

export class AcknowledgePostView extends Component {
  render() {
    return (
      <View style={style}>
        <Text>Acknowledge post.</Text>
      </View>
    );
  }
}
