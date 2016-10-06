import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Alert } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../../styles';
import colors from '../../colors';

import NewFollowerBulletin from './NewFollowerBulletin';
import FriendPostedNewListingBulletin from './FriendPostedNewListingBulletin';
import AddBankAccountBulletin from './AddBankAccountBulletin';
import NewMessagesBulletin from './NewMessagesBulletin';

import SpinnerOverlay from '../components/SpinnerOverlay';

import { followUser, updateBulletin } from '../firebase/FirebaseConnector';

const notificationDescriptionFontSize = 15;

const initialSignedInState = {
  takingAction: false,
  actionDescription: '',
};

class SignedInBulletinBoard extends Component {
  constructor(props) {
    super(props);

    this.state = initialSignedInState;
  }

  finishTakingAction() {
    this.setState(initialSignedInState);
  }

  startTakingAction(actionDescription, callback) {
    this.setState({
      takingAction: true,
      actionDescription,
    }, () => {
      callback()
        .then(() => this.finishTakingAction())
        .catch((error) => {
          this.finishTakingAction();
          Alert.alert(error);
        });
    });
  }

  render() {
    const getBulletins = () => {
      const bulletins = [];

      Object.keys(this.props.bulletins).forEach((bulletinKey) => {
        const bulletin = this.props.bulletins[bulletinKey];

        if (bulletin.status === 'unread') {
          switch (bulletin.type) {
            case 'follow':
              bulletins.push(
                <View key={bulletinKey} style={{ paddingTop: 4, paddingBottom: 4 }}>
                  <NewFollowerBulletin
                    followUser={(uid) => {
                      this.startTakingAction(
                        `Following ${bulletin.payload.newFollowerPublicData.displayName}...`,
                        () => followUser(uid)
                          .then(() => {
                            updateBulletin(bulletinKey, {
                              status: 'read',
                              payload: {
                                ...bulletin.payload,
                                reciprocated: true,
                              },
                            });
                          })
                      );
                    }}
                    newFollowerBulletin={bulletin}
                  />
                </View>
              );
              break;
            case 'friend-posted-new-listing':
              bulletins.push(
                <View key={bulletinKey} style={{ paddingTop: 4, paddingBottom: 4 }}>
                  <FriendPostedNewListingBulletin
                    openDetails={() => {
                      this.props.goNext('details');
                      updateBulletin(bulletinKey, { status: 'read' });
                    }}
                    bulletin={bulletin}
                  />
                </View>
              );
              break;
            case 'should-add-bank-account':
              bulletins.push(
                <View key={bulletinKey} style={{ paddingTop: 4, paddingBottom: 4 }}>
                  <AddBankAccountBulletin
                    addBankAccount={() => this.props.goNext('addBank')}
                  />
                </View>
              );
              break;
            case 'new-message':
              bulletins.push(
                <View key={bulletinKey} style={{ paddingTop: 4, paddingBottom: 4 }}>
                  <NewMessagesBulletin
                    bulletin={bulletin}
                    takeAction={() => this.props.goNext('chat')}
                  />
                </View>
              );
              break;
            default:
              break;
          }
        }
      });

      return bulletins;
    };

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
            {getBulletins()}

            <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: notificationDescriptionFontSize }}>💌 Jordan messaged you about your listing 'Awesome cup that has a long title'.</Text>

            <View style={{padding: 4}} />

            <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: notificationDescriptionFontSize }}>💌 Jordan messaged you about your listing 'Awesome cup that has a long title'.</Text>

            <View style={{padding: 4}} />

            <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontSize: notificationDescriptionFontSize }}>🤑 Miron bought your listing 'massive cactus'.</Text>

            <SpinnerOverlay
              isVisible={this.state.takingAction}
              message={this.state.actionDescription}
              fillParent
            />
          </View>
        </View>
      </View>
    );
  }
}
SignedInBulletinBoard.propTypes = {
  bulletins: React.PropTypes.object,
  goNext: React.PropTypes.func.isRequired,
};


const SignedOutBulletinBoard = function SellerInfoOverlay({ goNext }) {
  const FlatButton = MKButton.flatButton()
    .withStyle({
      borderRadius: 5,
    })
    .withBackgroundColor(colors.white)
    .withOnPress(() => goNext('signIn'))
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
          <Text style={styles.menuText}>Sign in <Icon name="sign-in" size={20} /></Text>
        </FlatButton>
      </View>
    </View>
  );
};
SignedOutBulletinBoard.propTypes = {
  goNext: React.PropTypes.func.isRequired,
};

function BulletinBoard(props) {
  if (props.isSignedIn) {
    return <SignedInBulletinBoard {...props} />;
  }
  return <SignedOutBulletinBoard {...props} />;
}
BulletinBoard.propTypes = {
  isSignedIn: React.PropTypes.bool.isRequired,
  goNext: React.PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    bulletins: state.bulletins,
    isSignedIn: !!state.user.username,
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BulletinBoard);
