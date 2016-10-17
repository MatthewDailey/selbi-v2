import FirebaseTest, { testUserUid } from '@selbi/firebase-test-resource';

import { writeToQueueAndExpectHandled } from './QueueUtilities';

const testEvent = {
  owner: testUserUid,
  timestamp: 1,
  type: 'followed',
};

const testEventWithPayload = {
  owner: testUserUid,
  timestamp: 1,
  type: 'followed',
  payload: 'a value',
};

describe('/events', function () {
  this.timeout(6000);

  it('can write without payload', (done) => {
    writeToQueueAndExpectHandled(
      FirebaseTest.testUserApp,
      'events',
      testEvent,
      done);
  });

  it('can write with payload', (done) => {
    writeToQueueAndExpectHandled(
      FirebaseTest.testUserApp,
      'events',
      testEventWithPayload,
      done);
  });
});

