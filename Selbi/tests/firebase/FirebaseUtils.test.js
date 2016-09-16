import { expect } from 'chai';

import { convertToUsername } from '../../src/firebase/FirebaseUtils';

describe('FirebaseUtils', () => {
  describe('convertToUsername', () => {
    it('can convert with spaces', () => {
      expect(convertToUsername('Matt Dailey')).to.equal('mattdailey');
    });

    it('can convert with non numeric', () => {
      expect(convertToUsername('Matt\'\' Dailey')).to.equal('mattdailey');
    });

    it('can convert with tab', () => {
      expect(convertToUsername('Ma\ttt\'\' Dailey')).to.equal('mattdailey');
    });
  });
});
