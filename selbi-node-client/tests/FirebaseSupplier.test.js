import dirtyChai from 'dirty-chai';
import chai, { expect } from 'chai';

import { getFirebase } from '../src/FirebaseSupplier';

chai.use(dirtyChai);

describe('FirebaseSupplier Test', () => {
  it('can supply firebase', () => {
    expect(getFirebase).to.exist();
  });

  it('supplies the same firebase', () => {
    const firebaseOne = getFirebase();
    const firebaseTwo = getFirebase();

    expect(firebaseOne).to.equal(firebaseTwo);
  });
});
