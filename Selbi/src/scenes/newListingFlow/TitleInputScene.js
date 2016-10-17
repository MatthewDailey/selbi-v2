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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputScene);
