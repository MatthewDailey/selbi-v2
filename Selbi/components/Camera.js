import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Image,
  Text,
  View,
} from 'react-native';
import firebase from 'firebase';
import Camera from 'react-native-camera';

console.log(Camera)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height - 44,
    width: Dimensions.get('window').width,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
  },
});

export default class BadInstagramCloneApp extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   imgPath: 'assets-library://asset/asset.JPG?id=CF850DF7-8A2C-492C-8972-24DBCB902D4B&ext=JPG',
    // };
  }


  takePicture() {
    this.camera.capture()
      .then((data) => {
        console.log(data)
        this.setState({
          imgPath: data.path,
        });
        console.log(this.state);
      })
      .catch(err => console.error(err));
  }

  render() {
    console.log(this.state);
    if (this.state && this.state.imgPath) {
      return (
          <Image
            style={styles.preview}
            source={{ uri: this.state.imgPath }}
          />
      );
    }
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
        >
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
        </Camera>
      </View>
    );
  }
}