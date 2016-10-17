import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

import myListingsReducer, { setMyListingsPublic } from '../../src/reducers/MyListingsReducer';

chai.use(dirtyChai);

describe('MyListingsReducer', () => {
  it('can set public', () => {
    const initialState = myListingsReducer();

    const publicListings = [{ listing: 0 }, { listing: 1 }];
    const afterSettingListings = myListingsReducer(initialState,
      setMyListingsPublic(publicListings));

    console.log(afterSettingListings);
    expect(afterSettingListings.public[0].listing).to.equal(0);
    expect(afterSettingListings.public[1].listing).to.equal(1);
  });
});
