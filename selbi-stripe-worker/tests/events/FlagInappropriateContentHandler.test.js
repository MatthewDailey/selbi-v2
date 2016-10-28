import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

import FirebaseTest, { minimalUserUid } from '@selbi/firebase-test-resource';

import FlagInappropriateContentHandler from '../../src/events/FlagInappropriateContentHandler';

chai.use(dirtyChai);

const handler = new FlagInappropriateContentHandler();

const inappropriateListingId = '-KUnye2SHB0eNdU1b12-';
const inappropriateListing = FirebaseTest.getMinimalUserListingOne();

const validEvent = {
  type: 'inappropriate-content',
  timestamp: 1,
  owner: minimalUserUid,
  payload: {
    listingId: inappropriateListingId,
    listingUrl: 'http://deep-link-to-listing',
  },
};

describe('events - FlagInappropriateContentHandler', () => {
  it('accepts \'inappropriate-content\' events', () => {
    expect(handler.accept({ type: 'inappropriate-content' })).to.be.true();
  });

  it('does not accept generic type', () => {
    expect(handler.accept({ type: 'arbitrary' })).to.be.false();
  });

  describe('sucessfully mark bulletin as read', () => {
    before(function (done) {
      this.timeout(6000);
      done();
      //
      // FirebaseTest
      //   .createMinimalUser()
      //   .then(() => FirebaseTest
      //     .minimalUserApp
      //     .database()
      //     .ref('listings')
      //     .child(inappropriateListingId)
      //     .set(inappropriateListing))
      //   .then(done)
      //   .catch(done);
    });

    it('can update', function(done) {
      this.timeout(6000);

      handler.handle(
        validEvent,
        FirebaseTest.serviceAccountApp.database())
        .then(done)
        .catch(done);
    });
  });
});


