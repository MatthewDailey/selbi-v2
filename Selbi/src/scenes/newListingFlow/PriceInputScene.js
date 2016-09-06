import { connect } from 'react-redux';

import InputScene from '../InputScene';
import { setNewListingPrice } from '../../reducers/NewListingReducer';


function getPriceString(state) {
  const price = state.newListing.get('price');
  if (price) {
    return price.toString();
  }
  return undefined;
}

const mapStateToProps = (state) => {
  return {
    inputValue: getPriceString(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recordInput: (value) => {
      dispatch(setNewListingPrice(value));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputScene);
