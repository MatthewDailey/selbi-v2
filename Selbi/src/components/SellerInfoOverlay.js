import React from 'react';
import { View, Text, Alert } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../../styles';
import colors from '../../colors';

export default function SellerInfoOverlay() {
  const FlatButton = MKButton.flatButton()
    .withStyle({
      borderRadius: 5,
    })
    .withBackgroundColor(colors.white)
    .withOnPress(() => Alert.alert('Sorry, not yet supported.'))
    .build();

  return (
    <View>
      <View
        style={{
          margin: 8,
          shadowOffset:{
            width: 2,
            height: 2,
          },
          shadowColor: 'black',
          shadowOpacity: 1.0,
        }}
      >
        <View style={styles.paddedContainer}>
          <Text>You currently have:</Text>

          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, alignItems: 'center' }}>
              <Text
                style={{
                  color: colors.public,
                  fontSize: 20,
                  fontWeight: '300',
                  padding: 8,
                }}
              >
                0
              </Text>
              <Text style={{ fontSize: 10, color: colors.public }}>Public Listings</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text
                style={{
                  color: colors.private,
                  fontSize: 20,
                  fontWeight: '300',
                  padding: 8,
                }}
              >
                0
              </Text>
              <Text style={{ fontSize: 10, color: colors.private }}>Private Listings</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text
                style={{
                  color: colors.accent,
                  fontSize: 20,
                  fontWeight: '300',
                  padding: 8,
                }}
              >
                0
              </Text>
              <Text style={{ fontSize: 10, color: colors.accent }}>New Notifications</Text>
            </View>
          </View>

          <View style={{padding: 4}} />

          <View style={{alignItems: 'flex-end'}}>
            <FlatButton>
              <Text>Try selling something <Icon name="arrow-right"/></Text>
            </FlatButton>
          </View>

          <View style={{padding: 8}} />

          <Text >Since you've been gone:</Text>

          <View style={{padding: 4}} />

          <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: 10 }}>No activity. You should add some friends or chat with a seller.</Text>

          <View style={{padding: 4}} />

          <View style={{alignItems: 'flex-end'}}>
            <FlatButton>
              <Text>Add some friends <Icon name="arrow-right"/></Text>
            </FlatButton>
          </View>

          <View style={{padding: 4}} />

          <View style={{alignItems: 'center'}}>
            <FlatButton>
              <Text><Icon name="arrow-down"/> Check out some cool listings <Icon name="arrow-down"/></Text>
            </FlatButton>
          </View>

        </View>
      </View>
    </View>
  );
}
