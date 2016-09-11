import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

import listingDetailReducer, { clearListingDetails, setListingDetails }
  from '../../src/reducers/ListingDetailReducer';

chai.use(dirtyChai);

const testImage = {
  key: 'ik',
  data: {
    foo: 'bar',
  },
};

const testListing = {
  key: 'lk',
  data: {
    baz: 'boop',
  },
};

describe('ListingDetailReducer', () => {
  it('can set details', () => {
    const initialState = listingDetailReducer();

    const afterSettingState = listingDetailReducer(initialState,
      setListingDetails(testImage, testListing));

    expect(afterSettingState.imageKey).to.equal(testImage.key);
    expect(afterSettingState.imageData).to.equal(testImage.data);
    expect(afterSettingState.listingKey).to.equal(testListing.key);
    expect(afterSettingState.listingData).to.equal(testListing.data);
  });

  it('can clear details', () => {
    const initialState = listingDetailReducer();

    expect(initialState).to.be.empty();

    const afterSettingState = listingDetailReducer(initialState,
      setListingDetails(testImage, testListing));

    expect(afterSettingState).to.not.be.empty();

    const afterClearingState = listingDetailReducer(afterSettingState, clearListingDetails());

    expect(afterClearingState).to.be.empty();
  });
});
