import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

import addBankAccountReducer, { setDobDay } from '../../src/reducers/AddBankAccountReducer';

chai.use(dirtyChai);

describe('AddBankAccountReducer', () => {
  it('can set nested single field', () => {
    const initialState = addBankAccountReducer();

    const day = 20;
    const afterSettingListings = addBankAccountReducer(initialState,
      setDobDay(day));

    expect(afterSettingListings.dobDay).to.equal(day);
  });
});
