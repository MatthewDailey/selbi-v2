import { connect } from 'react-redux';

import InputScene from '../InputScene';
import { setNewListingPrice } from '../../reducers/NewListingReducer';


function getPriceString(state) {
  const price = state.newListing.get('priceString');
  if (price) {
    return price.toString();
  }
  return '';
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
