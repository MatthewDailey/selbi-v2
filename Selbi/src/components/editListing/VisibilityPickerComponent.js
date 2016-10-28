import React from 'react';
import { View, Text, Alert } from 'react-native';

import { MKRadioButton } from 'react-native-material-kit';
import { getGeolocation } from '../../utils';
import VisibilityWrapper from '../../components/VisibilityWrapper';

import styles from '../../../styles';
import colors from '../../../colors';

export default function VisibilityPickerComponent({ listingStatus, setStatus, setLocation }) {
  const radioGroup = new MKRadioButton.Group();

  return (
    <View
      style={{
        paddingTop: 16,
        paddingBottom: 16,
      }}
    >
      <Text style={{ fontWeight: 'bold' }}>Listing Visibility</Text>
      <VisibilityWrapper isVisible={listingStatus === 'inactive'}>
        <Text style={{ color: colors.accent }}>
          This listing has been deleted. Select 'Anyone Nearby' or 'Just Friends' and save to
          restore.
        </Text>
      </VisibilityWrapper>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <View style={styles.halfPadded}>
          <MKRadioButton
            checked={listingStatus === 'public'}
            group={radioGroup}
            onPress={() => getGeolocation()
              .then(setLocation)
              .then(() => setStatus('public'))
              .catch((error) =>
                Alert.alert(`There was an error fetching your location. ${error}`))
            }
          />
          <Text>Anyone Nearby</Text>
        </View>
        <View style={styles.halfPadded}>
          <MKRadioButton
            checked={listingStatus === 'private'}
            group={radioGroup}
            onPress={() => setStatus('private')}
          />
          <Text>Just Friends</Text>
        </View>
      </View>
    </View>
  );
}
VisibilityPickerComponent.propTypes = {
  listingStatus: React.PropTypes.oneOf(['inactive', 'public', 'private']),
  setStatus: React.PropTypes.func.isRequired,
  setLocation: React.PropTypes.func.isRequired,
};
