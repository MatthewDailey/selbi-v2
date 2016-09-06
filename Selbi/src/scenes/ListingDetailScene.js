import React from 'react';
import { Image, View, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MKButton } from 'react-native-material-kit';

import { createChatAsBuyer, getUser, registerWithEmail, signInWithEmail, createUser }
  from '../firebase/FirebaseConnector';
import ChatScene from './ChatScene';

// noinspection Eslint - Dimensions provided by react-native env.
import Dimensions from 'Dimensions';

import styles from '../../styles';
import colors from '../../colors';
import SignInOrRegisterScene from './SignInOrRegisterScene';
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
    const imageData = this.props.imageData;
    const listingData = this.props.listingData.val();

    console.log(listingData)

    const { width } = Dimensions.get('window');

    const openChat = () => {
      if (!getUser()) {
        this.openSimpleScene(
          <SignInOrRegisterScene
            title="Please sign in to message."
            leftIs="back"
            registerWithEmail={registerWithEmail}
            signInWithEmail={signInWithEmail}
            createUser={createUser}
            goBackOnComplete
          />
        );
      } else if (listingData.sellerId === getUser().uid) {
        Alert.alert('This is your listing. You already own this! 😀'); // there is an emoji inline.
      } else {
        createChatAsBuyer(this.props.listingData.key, listingData.sellerId);
        const chatData = {
          title: listingData.title,
          listingId: this.props.listingData.key,
          sellerUid: listingData.sellerId,
          buyerUid: getUser().uid,
        };
        console.log(chatData)
        this.openSimpleScene(
          <ChatScene
            title={chatData.title}
            chatData={chatData}
            leftIs="back"
          />
        );
      }
    };

    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.dark,
      }}>
        <Image
          source={{ uri: `data:image/png;base64,${imageData.base64}` }}
          style={{
            flex: 1,
            width: width,
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
              <Text style={fontStyle}>{`$${listingData.price}`}</Text>
              <Text style={fontStyle}><Icon name="heart-o" size={30} color={colors.white} /></Text>
            </View>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
              <View style={buttonViewStyle}>
                <Button
                  onPress={openChat}
                >
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