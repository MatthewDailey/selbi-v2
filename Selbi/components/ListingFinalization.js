import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';

const style = {
  backgroundColor: 'white',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};


class InputView extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = { text: props.listingStore[props.dataToStore] };
  }

  render() {
    return (
      <View style={style}>
        <Text>{this.props.inputTitle}</Text>
        <TextInput
          style={{ height: 40, margin:20, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => {
            this.setState({ text });
            this.props.listingStore[this.props.dataToStore] = text;
            console.log(this.props.listingStore);
          }}
          value={this.state.text}
        />
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

export class AcknowledgePostView extends Component {
  render() {
    return (
      <View style={style}>
        <Text>Acknowledge post.</Text>
      </View>
    );
  }
}
