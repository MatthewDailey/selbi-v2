import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { createStore } from 'redux';

import userReducer, {
  setUserData,
  setUserToken,
} from '../../src/reducers/UserReducer';

chai.use(dirtyChai);

describe('NewListingReducer', () => {
  const initialState = userReducer();

  it('is empty by default', () => {
    expect(initialState.user).to.equal(undefined);
    expect(initialState.token).to.equal(undefined);
  });

  it('can set user data', () => {
    const userData = { a: 'b' };
    expect(userReducer(initialState, setUserData(userData)).data.toObject().a).to.equal(userData.a);
  });

  it('can set user token', () => {
    const userToken = 'a cool token';
    expect(userReducer(initialState, setUserToken(userToken)).token).to.equal(userToken);
  })
});
