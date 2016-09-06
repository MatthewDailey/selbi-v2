import { connect } from 'react-redux';

import InputScene from '../InputScene';
import { setNewListingTitle } from '../../reducers/NewListingReducer';


const mapStateToProps = (state) => {
  return {
    inputValue: state.newListing.title,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recordInput: (value) => {
      dispatch(setNewListingTitle(value));
    },
  };
};

const PriceInputScene = connect(
  mapStateToProps,
  mapDispatchToProps
)(InputScene);

export default PriceInputScene;
