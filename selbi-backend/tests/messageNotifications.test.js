import FirebaseTest, { testUserUid } from '@selbi/firebase-test-resource';

import { writeToQueueAndExpectHandled } from './QueueUtilities';

const testMessageNotification = {
  listingId: 'test-listing-id',
  buyerId: testUserUid,
  messageId: 'test-message-id',
};

describe('/messageNotifications', () => {
  it('test writing to queue', (done) => {
    writeToQueueAndExpectHandled(
      FirebaseTest.testUserApp,
      'messageNotifications',
      testMessageNotification,
      done);
  });
});

