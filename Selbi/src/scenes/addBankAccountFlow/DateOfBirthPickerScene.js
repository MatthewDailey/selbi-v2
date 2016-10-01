import React from 'react';
import { connect } from 'react-redux';
import { View, Text, DatePickerIOS } from 'react-native';


import styles from '../../../styles';
import RoutableScene from '../../nav/RoutableScene';

import { setDob } from '../../reducers/AddBankAccountReducer';

class DateOfBirthPicker extends RoutableScene {
  constructor(props) {
    super(props);
    this.parseAndPublishDate = this.parseAndPublishDate.bind(this);
  }

  parseAndPublishDate(date) {
    console.log('date: ', date);
    this.props.recordDob({
      month: date.getMonth() + 1,
      day: date.getDate(),
      year: date.getFullYear(),
    });
  }

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
              onDateChange={this.parseAndPublishDate}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default connect(
  (state) => {
    console.log(state.addBank);
    return {
      date: new Date(state.addBank.dobYear, state.addBank.dobMonth - 1, state.addBank.dobDay),
    };
  },
  (dispatch) => {
    return {
      recordDob: (value) => dispatch(setDob(value)),
    };
  }
)(DateOfBirthPicker);