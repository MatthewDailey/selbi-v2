import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

import createNewListingReducer from '../../src/reducers/CreateNewListingStoreReducer';

chai.use(dirtyChai);


describe('CreateNewListingReducer', () => {
  it('returns initial state', () => {
    expect(createNewListingReducer().get('status')).to.equal('building');
  });
});
