import chai, { expect } from 'chai'
import dirtyChai from 'dirty-chai';

import { isStringFloat, distanceInMilesString } from '../../src/utils';

chai.use(dirtyChai);

describe('utils', () => {
  describe('isStringFloat', () => {
    it('will match empty', () => {
      expect(isStringFloat('')).to.be.true();
    });

    it('will not match all alpha', () => {
      expect(isStringFloat('abs')).to.be.false();
    });

    it('will not match starting alpha', () => {
      expect(isStringFloat('abs123')).to.be.false();
    });

    it('will not match ending alpha', () => {
      expect(isStringFloat('123abs')).to.be.false();
    });

    it('will not match middle alpha', () => {
      expect(isStringFloat('123abs123')).to.be.false();
    });

    it('can match int', () => {
      expect(isStringFloat('12')).to.be.true();
    });

    it('can match int single digit', () => {
      expect(isStringFloat('1')).to.be.true();
    });

    it('can match int starting with 0', () => {
      expect(isStringFloat('00012')).to.be.true();
    });

    it('can match int ending with .', () => {
      expect(isStringFloat('00012.')).to.be.true();
    });

    it('can match float', () => {
      expect(isStringFloat('00012.12')).to.be.true();
    });

    it('can match float <1', () => {
      expect(isStringFloat('.12')).to.be.true();
    });

    it('can match float <1 preceeding zeros', () => {
      expect(isStringFloat('0.12')).to.be.true();
    });

    it('will not match more than 2 decimals', () => {
      expect(isStringFloat('0.123')).to.be.false();
    });
  });

  describe('distanceInMilesString', () => {
    it('distance between 1 point is 0', () => {
      const pointOne = {
        lat: 37.785834,
        lon: -122.406417,
      };
      expect(distanceInMilesString(pointOne, pointOne)).to.equal('<1');
    });
    it('distance between 1 point is 0', () => {
      const pointOne = {
        lat: 37.785834,
        lon: -122.406417,
      };
      const pointTwo = {
        lat: 37.785834,
        lon: -122.506417,
      };
      expect(distanceInMilesString(pointOne, pointTwo)).to.equal('5');
    });
  });
});
