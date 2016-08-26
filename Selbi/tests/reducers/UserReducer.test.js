import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

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

  it('can set user credential', () => {
    const userCred = { complex: 'object' };
    expect(userReducer(initialState, setUserToken(userCred)).credential.toObject().complex)
      .to.equal(userCred.complex);
  })
});
