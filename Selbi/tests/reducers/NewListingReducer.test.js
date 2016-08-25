import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

import newListingReducer, {
  setNewListingSeller,
  setNewListingPrice,
  setNewListingTitle,
  setNewListingDescription,
  setNewListingLocation,
} from '../../src/reducers/NewListingStoreReducer';

chai.use(dirtyChai);


describe('NewListingReducer', () => {
  const initialState = newListingReducer();

  it('returns initial state', () => {
    expect(initialState.get('status')).to.equal('building');
  });

  it('can set seller uid', () => {
    const setSellerAction = setNewListingSeller('testUid');
    expect(newListingReducer(initialState, setSellerAction).get('sellerUid')).to.equal('testUid');
  });

  it('can set price', () => {
    const testPrice = 1;
    expect(newListingReducer(initialState, setNewListingPrice(testPrice)).get('price'))
      .to.equal(testPrice);
  });

  it('can set title', () => {
    const testTitle = 'title test';
    expect(newListingReducer(initialState, setNewListingTitle(testTitle)).get('title'))
      .to.equal(testTitle);
  });

  it('can set description', () => {
    const testDescription = 'title desc';
    expect(newListingReducer(initialState, setNewListingDescription(testDescription))
      .get('description')).to.equal(testDescription);
  });

  it('can set location', () => {
    const testLocation = {
      lat: 12,
      lon: 12,
    };
    expect(newListingReducer(initialState, setNewListingLocation(testLocation)).get('location'))
      .to.equal(testLocation);
  });
});
