import React from 'react';
import { Image, View, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MKButton } from 'react-native-material-kit';

// noinspection Eslint - Dimensions provided by react-native env.
import Dimensions from 'Dimensions';

import styles from '../../styles';
import colors from '../../colors';
import RoutableScene from '../nav/RoutableScene';

const fontStyle = {
  margin: 10,
  color: 'white',
  fontSize: 30,
  backgroundColor: 'transparent',
};

const buttonViewStyle = {
  flex: 1,
  marginBottom: 40,
  marginLeft: 20,
  marginRight: 20,
};

const Button = MKButton.button()
  .withStyle({
    borderRadius: 5,
    padding: 15,
  })
  .withBackgroundColor(colors.white)
  .withOnPress(() => Alert.alert('Sorry, not yet supported.'))
  .build();

export default class ListingDetailScene extends RoutableScene {
  renderWithNavBar() {
    const imageHieght = 524;
    const imageWidth = 320;

    const imageData = require('./testImage.json');

    const { width } = Dimensions.get('window');

    const widthRatio = imageData.width / width;
    const fitHeight = imageData.height / widthRatio;

    return (
      <View style={{
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: colors.dark,
      }}>
        <Image
          source={{ uri: `data:image/png;base64,${imageData.base64}` }}
          style={{
            width: width,
            height: fitHeight,
          }}
        >
          <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <Text style={fontStyle}>$124.30</Text>
              <Text style={fontStyle}><Icon name="heart-o" size={30} color={colors.white} /></Text>
            </View>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
              <View style={buttonViewStyle}>
                <Button>
                  <Text>MESSAGE</Text>
                </Button>
              </View>
              <View style={buttonViewStyle}>
                <Button>
                  <Text>BUY</Text>
                </Button>
              </View>
            </View>
          </View>

        </Image>
      </View>
    );
  }
}