import React from 'react';
import { connect } from 'react-redux';
import { Platform, View, Text, DatePickerIOS, DatePickerAndroid } from 'react-native';

import RoutableScene from '../../nav/RoutableScene';

import FlatButton from '../../components/buttons/FlatButton';

import styles from '../../../styles';

import { setDob } from '../../reducers/AddBankAccountReducer';

function DatePicker({ date, recordDob }) {
  const dob = {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };

  if (Platform.OS === 'android') {
    return (
      <View>
        <Text style={styles.friendlyTextLarge}>{`${dob.month}/${dob.day}/${dob.year}`}</Text>
        <FlatButton
          onPress={() => {
            DatePickerAndroid.open({ date })
              .then(({ action, year, month, day }) => {
                if (action !== DatePickerAndroid.dismissedAction) {
                  recordDob(new Date(year, month, day));
                }
              });
          }}
        >
          <Text style={styles.buttonText}>Set Date of Birth</Text>
        </FlatButton>
      </View>
    );
  }
  return (
    <DatePickerIOS
      date={date}
      mode="date"
      onDateChange={(newDate) => {
        console.log('Dob: ', newDate);
        recordDob(newDate);
      }}
    />
  );
}
DatePicker.propTypes = {
  date: React.PropTypes.object.isRequired,
  recordDob: React.PropTypes.func.isRequired,
};

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
            <DatePicker {...this.props} />
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
