import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

import RoutableScene from '../../nav/RoutableScene';
import VisibilityWrapper from '../../components/VisibilityWrapper'


import { setNewListingId, setNewListingLocation, setNewListingStatus, clearNewListing }
  from '../../reducers/NewListingReducer';

import styles from '../../../styles';
import colors from '../../../colors';

const Button = MKButton.button()
  .withStyle({
    borderRadius: 5,
  })
  .withBackgroundColor(colors.white)
  .build();

class ChooseVisibilityScene extends RoutableScene {
  renderWithNavBar() {
    return (
      <View style={styles.paddedContainer}>

        <Text>
          <Text style={styles.labelTextLeft}>Account Owner: </Text>
          <Text style={styles.friendlyTextLeft}>{this.props.bankAccount.legalName}</Text>
        </Text>

        <View style={styles.halfPadded} />

        <Text>
          <Text style={styles.labelTextLeft}>SSN or EIN: </Text>
          <Text style={styles.friendlyTextLeft}>{this.props.bankAccount.ssn}</Text>
        </Text>

        <View style={styles.halfPadded} />

        <Text>
          <Text style={styles.labelTextLeft}>Date of birth: </Text>
          <Text style={styles.friendlyTextLeft}>
            {`${this.props.bankAccount.dobMonth}/`
            + `${this.props.bankAccount.dobDay}/${this.props.bankAccount.dobYear}`}
          </Text>
        </Text>

        <View style={styles.halfPadded} />

        <Text style={styles.labelTextLeft}>Address:</Text>
        <Text style={styles.friendlyTextLeft}>{this.props.bankAccount.addressLine1}</Text>
        <VisibilityWrapper isVisible={!!this.props.bankAccount.addressLine2}>
          <Text style={styles.friendlyTextLeft}>{this.props.bankAccount.addressLine2}</Text>
        </VisibilityWrapper>
        <Text style={styles.friendlyTextLeft}>
          {this.props.bankAccount.addressCity} {this.props.bankAccount.addressState}
        </Text>
        <Text style={styles.friendlyTextLeft}>{this.props.bankAccount.addressPostalCode}</Text>

        <View style={styles.halfPadded} />

        <Text>
          <Text style={styles.labelTextLeft}>Routing Number: </Text>
          <Text style={styles.friendlyTextLeft}>{this.props.bankAccount.routingNumber}</Text>
        </Text>

        <View style={styles.halfPadded} />

        <Text>
          <Text style={styles.labelTextLeft}>Account Number: </Text>
          <Text style={styles.friendlyTextLeft}>{this.props.bankAccount.accountNumber}</Text>
        </Text>

        <View style={styles.padded} />

        <Button onPress={() => alert('unsupported')}>
          <Text><Icon name="university"/> Add Bank Account</Text>
        </Button>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    bankAccount: state.addBank,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNewListingId: (id) => {
      dispatch(setNewListingId(id));
    },
    setNewListingLocation: (location) => {
      dispatch(setNewListingLocation(location));
    },
    clearNewListingData: () => dispatch(clearNewListing()),
    setListingStatus: (status) => dispatch(setNewListingStatus(status)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseVisibilityScene);
