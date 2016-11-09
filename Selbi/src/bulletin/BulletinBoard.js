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
import PurchaseBulletin from './PurchaseBulletin';
import EmptyBulletinBoardBulletin from './EmptyBulletinBoardBulletin';
import AddPhoneBulleting from './AddPhoneBulletin';

import SpinnerOverlay from '../components/SpinnerOverlay';
import FlatButton from '../components/buttons/FlatButton';

import { setBuyerAndListingDetails } from '../reducers/ListingDetailReducer';
import { setSellerProfileInfo } from '../reducers/SellerProfileReducer';
import { updateBulletin, loadListingData } from '../firebase/FirebaseConnector';

import { reportButtonPress } from '../SelbiAnalytics';

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
        .then(() => {
          // We don't want to update state if the component is not mounted.
          this.finishTakingAction();
        })
        .catch((error) => {
          this.finishTakingAction();
          console.log(error);
          Alert.alert('Oops! Something went wrong. We\'re on the case!');
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
                    gotIt={() => {
                      reportButtonPress('bulletin_follow_got_it');
                      updateBulletin(bulletinKey, { status: 'read' });
                    }}
                    onPress={() => {
                      reportButtonPress('bulletin_follow_back');
                      this.props.setSellerProfileInfo(
                        bulletin.payload.newFollowerUid,
                        bulletin.payload.newFollowerPublicData);
                      this.props.goNext('sellerProfile');
                      updateBulletin(bulletinKey, { status: 'read' });
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
                      reportButtonPress('bulletin_friends_new_listing_details');
                      this.props.goNext('details');
                      updateBulletin(bulletinKey, { status: 'read' });
                    }}
                    gotIt={() => {
                      reportButtonPress('bulletin_ack_new_listing');
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
                    addBankAccount={() => {
                      reportButtonPress('bulletin_add_bank');
                      this.props.goNext('addBank');
                    }}
                  />
                </View>
              );
              break;
            case 'should-add-phone':
              bulletins.push(
                <View key={bulletinKey} style={{ paddingTop: 4, paddingBottom: 4 }}>
                  <AddPhoneBulleting
                    takeAction={() => {
                      reportButtonPress('bulletin_add_phone');
                      this.props.goNext('addPhone');
                    }}
                  />
                </View>
              );
              break;
            case 'new-message':
              bulletins.push(
                <View key={bulletinKey} style={{ paddingTop: 4, paddingBottom: 4 }}>
                  <NewMessagesBulletin
                    bulletin={bulletin}
                    takeAction={() => {
                      reportButtonPress('bulletin_new_message');
                      this.startTakingAction('Opening chat...',
                        () => loadListingData(bulletin.payload.chat.listingId)
                          .then((listingSnapshot) => {
                            if (!listingSnapshot.exists()) {
                              return Promise.reject('Unable to load listing.');
                            }

                            this.props.setListingDetailsForChat(
                              bulletin.payload.chat.buyerUid,
                              bulletin.payload.chat.listingId,
                              listingSnapshot.val());
                            this.props.goNext('chat');
                          })
                          .then(() => updateBulletin(bulletinKey, { status: 'read' })));
                    }}
                  />
                </View>
              );
              break;
            case 'purchase':
              bulletins.push(
                <View key={bulletinKey} style={{ paddingTop: 4, paddingBottom: 4 }}>
                  <PurchaseBulletin
                    bulletin={bulletin}
                    gotIt={() => {
                      reportButtonPress('bulletin_acknowledge_purchase');
                      updateBulletin(bulletinKey, { status: 'read' })
                    }}
                  />
                </View>
              );
              break;
            default:
              break;
          }
        }
      });

      if (bulletins.length === 0) {
        bulletins.push(
          <View key={'no-bulletins'} style={{ paddingTop: 4, paddingBottom: 4 }}>
            <EmptyBulletinBoardBulletin goNext={this.props.goNext} />
          </View>
        );
      }

      return bulletins;
    };

    return (
      <View>
          <View style={styles.paddedContainer}>
            <Text style={{ fontWeight: 'bold', color: colors.black }}>Notifications</Text>
            {getBulletins()}
            <SpinnerOverlay
              isVisible={this.state.takingAction}
              message={this.state.actionDescription}
              fillParent
            />
          </View>
      </View>
    );
  }
}
SignedInBulletinBoard.propTypes = {
  bulletins: React.PropTypes.object,
  goNext: React.PropTypes.func.isRequired,
  setListingDetailsForChat: React.PropTypes.func.isRequired,
  setSellerProfileInfo: React.PropTypes.func.isRequired,
};


const SignedOutBulletinBoard = function SellerInfoOverlay({ goNext }) {

  return (
    <View>
      <View
        style={{
          margin: 8,
        }}
      >
        <FlatButton
          onPress={() => {
            reportButtonPress('bulletin_sign_in');
            goNext('signIn');
          }}
        >
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

const mapDispatchToProps = (dispatch) => {
  return {
    setListingDetailsForChat: (buyerUid, listingKey, listingData) => dispatch(
      setBuyerAndListingDetails(
        buyerUid,
        {
          key: listingKey,
          data: listingData,
        })
    ),
    setSellerProfileInfo: (sellerId, sellerData) =>
      dispatch(setSellerProfileInfo(sellerId, sellerData)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BulletinBoard);
