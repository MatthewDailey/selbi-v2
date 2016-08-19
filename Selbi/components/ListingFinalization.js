import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';

const style = {
  backgroundColor: 'white',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

const listingStore = {
  price: '',
  title: ''
};


class InputView extends Component {
  constructor(props) {
    super(props);
    this.state = { text: listingStore[props.dataToStore] };
  }

  render() {
    return (
      <View style={style}>
        <Text>{this.props.inputTitle}</Text>
        <TextInput
          style={{ height: 40, margin:20, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => {
            this.setState({ text });
            listingStore[this.props.dataToStore] = text;
            console.log(listingStore);
          }}
          value={this.state.text}
        />
      </View>
    );
  }
};


export function EnterTitleView() {
  return <InputView inputTitle={'What are you selling?'} dataToStore={'title'} />;
}

export function EnterPriceView() {
  return <InputView inputTitle={'How much does it cost?'} dataToStore={'price'} />;
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
