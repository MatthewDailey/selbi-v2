import React, { Component } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import firebase from 'firebase';

const ReadImageData = require('NativeModules').ReadImageData;

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
    ReadImageData.readImage(this.props.listingStore.img.url, (imageBase64) => {
      // firebase
      //   .storage()
      //   .ref('testFile')
      //   .put(imageBase64)
      //   .then(console.log)
      this.props.listingStore.img.base64 = imageBase64;
      firebase
        .database()
        .ref('listings')
        .push(this.props.listingStore)
        .then((snapshot) => {
          console.log(snapshot.val());
          this.props.listingstore.title = '';
          this.props.listingstore.price = '';

        })
        .catch(console.log);
      console.log(imageBase64);
    });
  }

  render() {
    var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII=';


    return (
      <View style={style}>

        <Image style={{width: 100, height: 50, resizeMode: Image.resizeMode.contain, borderWidth: 1, borderColor: 'red'}} source={{uri: base64Icon}}/>

        <Text>Successfully posted {this.props.listingStore.title}.</Text>
        <Text>Get ready to get paid!</Text>
      </View>
    );
  }
}
