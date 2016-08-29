import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { createStore } from 'redux';

import newListingReducer, {
  setNewListingPrice,
  setNewListingTitle,
  setNewListingDescription,
  setNewListingLocation,
  setNewListingImageDimensions,
  setNewListingImageLocalUri,
  setNewListingId,
} from '../../src/reducers/NewListingReducer';

chai.use(dirtyChai);

describe('NewListingReducer', () => {
  const initialState = newListingReducer();

  it('returns initial state', () => {
    expect(initialState.status).to.equal('building');
  });

  it('can set listing id', () => {
    const setListingIdAction = setNewListingId('testId');
    expect(newListingReducer(initialState, setListingIdAction).listingId).to.equal('testId');
  });

  it('can set price', () => {
    const testPrice = 1;
    expect(newListingReducer(initialState, setNewListingPrice(testPrice)).price)
      .to.equal(testPrice);
  });

  it('can set title', () => {
    const testTitle = 'title test';
    expect(newListingReducer(initialState, setNewListingTitle(testTitle)).title)
      .to.equal(testTitle);
  });

  it('can set description', () => {
    const testDescription = 'title desc';
    expect(newListingReducer(initialState, setNewListingDescription(testDescription)).description)
      .to.equal(testDescription);
  });

  it('can set location', () => {
    const testLocation = {
      lat: 12,
      lon: 12,
    };

    const locationState = newListingReducer(initialState, setNewListingLocation(testLocation));
    expect(locationState.locationLat).to.equal(testLocation.lat);
    expect(locationState.locationLon).to.equal(testLocation.lon);
  });

  it('can set image dimensions', () => {
    const height = 1;
    const width = 2;

    const hasDimensionsState = newListingReducer(initialState,
      setNewListingImageDimensions(height, width));
    expect(hasDimensionsState.imageHeight).to.equal(height);
    expect(hasDimensionsState.imageWidth).to.equal(width);
  });

  it('can set image local uri', () => {
    const imageUri = 'image uri';

    expect(newListingReducer(initialState, setNewListingImageLocalUri(imageUri)).imageUri)
      .to.equal(imageUri);
  });

  describe('as store', () => {
    it('can subscribe to store', (done) => {
      const listingTitle = 'test title';
      const newListingStore = createStore(newListingReducer);
      const unsubscribe = newListingStore.subscribe(() => {
        expect(newListingStore.getState().title).to.equal(listingTitle);
        unsubscribe();
        done();
      });
      newListingStore.dispatch(setNewListingTitle(listingTitle));
    });
  });

});
