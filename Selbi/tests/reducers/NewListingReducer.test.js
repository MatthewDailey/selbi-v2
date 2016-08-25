import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { createStore } from 'redux';

import newListingReducer, {
  setNewListingSeller,
  setNewListingPrice,
  setNewListingTitle,
  setNewListingDescription,
  setNewListingLocation,
  setNewListingImageBase64,
  setNewListingImageDimensions,
  setNewListingImageLocalUri,
} from '../../src/reducers/NewListingReducer';

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

  it('can set image', () => {
    const imageBase64 = 'fdsasfadsf';
    expect(newListingReducer(initialState, setNewListingImageBase64(imageBase64))
      .get('image').base64).to.equal(imageBase64);
  });

  it('can set image base64 and dimensions', () => {
    const imageBase64 = 'fdsasfadsf';
    const height = 1;
    const width = 2;
    const hasBase64State = newListingReducer(initialState, setNewListingImageBase64(imageBase64));
    expect(hasBase64State.get('image').base64).to.equal(imageBase64);

    const hasDimsAndBase64State = newListingReducer(hasBase64State,
      setNewListingImageDimensions(height, width));
    const imageState = hasDimsAndBase64State.get('image');
    expect(imageState.base64).to.equal(imageBase64);
    expect(imageState.height).to.equal(height);
    expect(imageState.width).to.equal(width);
  });

  it('can set image local uri', () => {
    const imageUri = 'image uri';

    expect(newListingReducer(initialState, setNewListingImageLocalUri(imageUri)).get('imageUri'))
      .to.equal(imageUri);
  });

  describe('as store', () => {
    it('can subscribe to store', (done) => {
      const listingTitle = 'test title';
      const newListingStore = createStore(newListingReducer);
      const unsubscribe = newListingStore.subscribe(() => {
        expect(newListingStore.getState().get('title')).to.equal(listingTitle);
        unsubscribe();
        done();
      });
      newListingStore.dispatch(setNewListingTitle(listingTitle));
    });
  });
});
