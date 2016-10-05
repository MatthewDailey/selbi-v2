import React from 'react';
import { View, Text, Alert } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../../styles';
import colors from '../../colors';

import NewFollowerBulletinComponent from './NewFollowerBulletinComponent';

const InactiveSellerInfo = function SellerInfoOverlay() {
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
              <Text style={{ fontSize: 10, color: colors.accent }}>Notifications</Text>
            </View>
          </View>

          <View style={{padding: 4}} />

          <View style={{alignItems: 'flex-end'}}>
            <FlatButton>
              <Text>Try selling something <Icon name="arrow-right"/></Text>
            </FlatButton>
          </View>

          <View style={{padding: 8}} />

          <View style={{padding: 4}} />

          <Text style={{ fontSize: 10 }}>No recent activity. You should add some friends or chat with a seller.</Text>

          <View style={{padding: 4}} />

          <View style={{alignItems: 'flex-end'}}>
            <FlatButton>
              <Text>Add some friends <Icon name="arrow-right"/></Text>
            </FlatButton>
          </View>

          <View style={{padding: 4}} />

          <View style={{alignItems: 'center'}}>
            <FlatButton>
              <Text><Icon name="arrow-down" /> Check out some cool listings <Icon name="arrow-down"/></Text>
            </FlatButton>
          </View>

        </View>
      </View>
    </View>
  );
}

const ActiveSellerInfo = function SellerInfoOverlay() {
  const FlatButton = MKButton.flatButton()
    .withStyle({
      borderRadius: 5,
    })
    .withBackgroundColor(colors.white)
    .withOnPress(() => Alert.alert('Sorry, not yet supported.'))
    .build();

  const notificationDescriptionFontSize = 15;

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

          <NewFollowerBulletinComponent
            followUser={(uid) => console.log(`follow ${uid}`)}
            newFollowerBulletin={{
              status: 'unread',
              timestamp: 1,
              type: 'follow',
              payload: {
                newFollowerPublicData: {
                  displayName: 'TJ Pavlu',
                  username: 'tjpavlu',
                },
                newFollowerUid: 'tj-uid',
              },
            }}
          />

          <View style={{padding: 4}} />

          <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: notificationDescriptionFontSize }}>💌 Jordan messaged you about your listing 'Awesome cup that has a long title'.</Text>

          <View style={{padding: 4}} />

          <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: notificationDescriptionFontSize }}>💌 Jordan messaged you about your listing 'Awesome cup that has a long title'.</Text>

          <View style={{padding: 4}} />

          <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: notificationDescriptionFontSize }}>🎁 Tommy added a new listing.</Text>

          <View style={{padding: 4}} />

          <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: notificationDescriptionFontSize }}>😘 TJ (@tjpavlu) is now following you.</Text>

          <View style={{padding: 4}} />

          <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: notificationDescriptionFontSize }}>🤑 Miron bought your listing 'massive cactus'.</Text>

          <View style={{padding: 4}} />

          <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: notificationDescriptionFontSize }}>...and 6 more notifications.</Text>

          <View style={{padding: 4}} />

          <View style={{alignItems: 'flex-end'}}>
            <FlatButton>
              <Text style={{ fontSize: notificationDescriptionFontSize + 2 }}>View all notifications <Icon name="arrow-right"/></Text>
            </FlatButton>
          </View>

        </View>
      </View>
    </View>
  );
}

const SignedOutSellerInfo = function SellerInfoOverlay() {
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
          shadowOffset: {
            width: 2,
            height: 2,
          },
          shadowColor: 'black',
          shadowOpacity: 1.0,
        }}
      >
        <FlatButton>
          <Text style={styles.menuText}>Sign in <Icon name="sign-in" size={20}/></Text>
        </FlatButton>
      </View>
    </View>
  );
}

export default ActiveSellerInfo;