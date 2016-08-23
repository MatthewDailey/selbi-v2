import React from 'react';
import { View, Text } from 'react-native';
import { MKButton, MKTextField } from 'react-native-material-kit';

import styles from '../../styles';
import colors from '../../colors';

export default function LoginOrRegisterScene() {
  return (
    <View style={styles.fullScreenContainer}>
      <View style={{ margin: 16 }}>
        <MKTextField
          tintColor={colors.white}
          highlightColor={colors.secondary}
          placeholder="Email"
          floatingLabelEnabled
        />
        <View style={{ marginTop: 16 }}>
          <MKTextField
            tintColor={colors.white}
            highlightColor={colors.secondary}
            placeholder="Password"
            secureTextEntry
            floatingLabelEnabled
          />
        </View>
        <MKButton
          borderRadius={2}
          style={{ marginTop: 16 }}
          ripple
          rippleColor={`${colors.secondary}aa`}
          backgroundColor={colors.white}
          shadowRadius={2}
          shadowOffset={{ width: 0, height: 3 }}
          shadowOpacity={0.7}
          shadowColor={colors.dark}
          onPress={() => {
            console.log('hi, raised button!');
          }}
        >
          <Text
            pointerEvents="none"
            style={{ color: colors.primary, textAlign: 'center', fontWeight: 'bold', margin: 5 }}
          >
            Submit
          </Text>
        </MKButton>
      </View>
    </View>
  );
}
//
// LoginOrRegisterScene.propTypes = {
//   // TODO
// };
