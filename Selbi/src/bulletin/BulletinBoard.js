import React from 'react';
import { connect } from 'react-redux';
import { View, Text, Alert } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../../styles';
import colors from '../../colors';

import NewFollowerBulletin from './NewFollowerBulletin';

const notificationDescriptionFontSize = 15;

const SignedInBulletinBoard = function SellerInfoOverlay(props) {
  const getBulletins = () => {
    const bulletins = [];

    Object.keys(props.bulletins).forEach((bulletinKey) => {
      const bulletin = props.bulletins[bulletinKey];

      if (bulletin.status === 'unread') {
        switch (bulletin.type) {
          case 'follow':
            bulletins.push(
              <NewFollowerBulletin
                key={bulletinKey}
                followUser={(uid) => console.log(`follow ${uid}`)}
                newFollowerBulletin={bulletin}
              />
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

        </View>
      </View>
    </View>
  );
}

const SignedOutBulletinBoard = function SellerInfoOverlay({ signIn }) {
  const FlatButton = MKButton.flatButton()
    .withStyle({
      borderRadius: 5,
    })
    .withBackgroundColor(colors.white)
    .withOnPress(signIn)
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
  signIn: React.PropTypes.func.isRequired,
};

function BulletinBoard(props) {
  if (props.isSignedIn) {
    return <SignedInBulletinBoard {...props} />;
  }
  return <SignedOutBulletinBoard {...props} />;
}
BulletinBoard.propTypes = {
  isSignedIn: React.PropTypes.bool.isRequired,
  signIn: React.PropTypes.func.isRequired,
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
