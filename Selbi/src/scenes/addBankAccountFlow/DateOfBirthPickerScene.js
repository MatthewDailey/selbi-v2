import React from 'react';
import { connect } from 'react-redux';
import { View, Text, DatePickerIOS } from 'react-native';


import styles from '../../../styles';
import RoutableScene from '../../nav/RoutableScene';

import { setDob } from '../../reducers/AddBankAccountReducer';

class DateOfBirthPicker extends RoutableScene {
  renderWithNavBar() {
    return (
      <View style={styles.container}>
        <View style={styles.padded}>
          <View style={styles.padded}>
            <Text style={styles.friendlyTextLeft}>
              What is the bank account owner's date of birth?
            </Text>
          </View>
          <View style={styles.padded}>
            <DatePickerIOS
              date={this.props.date}
              mode="date"
              onDateChange={this.props.recordDob}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default connect(
  (state) => {
    return {
      date: state.addBank.dob,
    };
  },
  (dispatch) => {
    return {
      recordDob: (value) => dispatch(setDob(value)),
    };
  }
)(DateOfBirthPicker);