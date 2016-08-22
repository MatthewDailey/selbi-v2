import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import firebase from 'firebase';
import ImageReader from '@selbi/react-native-image-reader';

const style = {
  backgroundColor: 'white',
  flex: 1,
  alignItems: 'center',
};


class InputView extends Component {
  constructor(props) {
    super(props);
    this.state = { text: props.listingStore[props.dataToStore] };
  }

  render() {
    return (
      <View style={style}>
        <Text>{this.props.inputTitle}</Text>
        <TextInput
          autoFocus
          style={{ height: 40, margin:20, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => {
            this.setState({ text });
            this.props.listingStore[this.props.dataToStore] = text;
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
  componentDidMount() {
    ImageReader
      .readImage(this.props.listingStore.img.url)
      .then((imageBase64) => {
        this.props.listingStore.img.base64 = imageBase64;
        return firebase
          .database()
          .ref('listings')
          .push(this.props.listingStore)
          .then(() => {
            this.props.listingStore.title = '';
            this.props.listingStore.price = '';
          });
      })
      .catch(console.log);
  }

  render() {
    return (
      <View style={style}>
        <Text>Successfully posted {this.props.listingStore.title}.</Text>
        <Text>Get ready to get paid!</Text>
      </View>
    );
  }
}
