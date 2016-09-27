import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import { CreditCardInput } from 'react-native-credit-card-input';

import { setCreditCard } from '../../reducers/AddCreditCardReducer';

import { paddingSize } from '../../../styles';
import colors from '../../../colors';
import RoutableScene from '../../nav/RoutableScene';
import VisibilityWrapper from '../../components/VisibilityWrapper';

const Button = MKButton.button()
 .withStyle({
   borderRadius: 5,
   margin: paddingSize,
 })
  .withBackgroundColor(colors.white)
  .withOnPress(() => alert('Sorry, not yet supported.'))
  .build();

class CreditCardInputScene extends RoutableScene {
  renderWithNavBar() {
    console.log(this.props.creditCardData.valid);

    return (
      <View style={{ paddingTop: paddingSize }}>
        <CreditCardInput
          autoFocus
          requiresName
          invalidColor={colors.accent}
          onChange={this.props.setCreditCardData}
        />
        <VisibilityWrapper isVisible={this.props.creditCardData.valid}>
          <Button><Text>Submit</Text></Button>
        </VisibilityWrapper>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    creditCardData: state.addCreditCard,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCreditCardData: (data) => {
      dispatch(setCreditCard(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditCardInputScene);
