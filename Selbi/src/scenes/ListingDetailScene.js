import React from 'react';
import { InteractionManager, Image, View, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MKButton } from 'react-native-material-kit';

import { createChatAsBuyer, getUser, registerWithEmail, signInWithEmail, createUser }
  from '../firebase/FirebaseConnector';
import ChatScene from './ChatScene';

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
  constructor(props, context) {
    super(props, context);
    this.state = { renderPlaceholderOnly: true };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false });
    });
  }

  renderWithNavBar() {
    if (this.state.renderPlaceholderOnly) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: `${colors.dark}`,
          }}
        >
          <View style={styles.paddedCenterContainerClear}>
            <Text
              color={colors.white}
              style={styles.friendlyTextLight}
            >
              Loading listing...
            </Text>
          </View>
        </View>
      );
    }

    const imageData = this.props.imageData;
    const listingData = this.props.listingData;

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
        createChatAsBuyer(this.props.listingKey, listingData.sellerId);
        const chatData = {
          title: listingData.title,
          listingId: this.props.listingKey,
          sellerUid: listingData.sellerId,
          buyerUid: getUser().uid,
        };
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
        backgroundColor: colors.dark,
      }}>
        <Image
          source={{ uri: `data:image/png;base64,${imageData.base64}` }}
          style={{
            flex: 1,
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