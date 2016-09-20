import { expect } from 'chai';
import { spy } from 'sinon';

import FirebaseTest, { minimalUserUid, testUserUid } from '@selbi/firebase-test-resource';
import MessageNotificationHandler from '../src/MessageNotificationsHandler';

const testListingId = 'testMessageNotificationListing';

const testUserDisplayName = 'awesome tester';
const minimalUserFcmToken = 'fake-fcm-token';

const testMessageId = 'testMessage';
const testMessage = {
  authorUid: testUserUid,
  text: 'cool message text',
  createdAt: 1,
};

const testMessageNotification = {
  listingId: testListingId,
  messageId: testMessageId,
  buyerId: minimalUserUid,
};

// Test demonstrates test user sending minimal user a message about a listing test user is selling.

describe('MessageNotificationsHandler', () => {
  before(function (done) {
    this.timeout(10000);

    FirebaseTest.dropDatabase()
      .then(() => FirebaseTest.createMinimalUser())
      .then(() => FirebaseTest.testUserApp.database()
        .ref('users')
        .child(testUserUid)
        .set(FirebaseTest.getMinimalUserData()))
      // Store minimalUser fcmToken.
      .then(() => FirebaseTest.minimalUserApp.database()
        .ref('users')
        .child(minimalUserUid)
        .update({
          fcmToken: minimalUserFcmToken,
        }))
      // Store testUser displayName.
      .then(() => FirebaseTest.testUserApp.database()
        .ref('userPublicData')
        .child(testUserUid)
        .update({
          displayName: testUserDisplayName,
          username: 'testuser',
        }))
      // Store listing.
      .then(() => FirebaseTest.serviceAccountApp.database()
        .ref('listings')
        .child(testListingId)
        .set(FirebaseTest.getTestUserListingOne()))
      // Store message.
      .then(() => FirebaseTest.testUserApp.database()
        .ref('messages')
        .child(testListingId)
        .child(minimalUserUid)
        .child(testMessageId)
        .set(testMessage))
      .then(done)
      .catch(done);
  });

  it('will send fcm notification with proper values', (done) => {
    const sendNotificationSpy = spy();
    const messageNotificationHandler = new MessageNotificationHandler(
      FirebaseTest.serviceAccountApp.database(),
      sendNotificationSpy);

    const progress = spy();
    const resolve = spy();
    const reject = spy();

    messageNotificationHandler.getTaskHandler()(
      testMessageNotification,
      progress,
      resolve,
      reject)
      .then(() => {
        expect(sendNotificationSpy.called, 'Should call sendNotification').to.equal(true);
        const firstSendNotificationCallArgs = sendNotificationSpy.args[0];
        expect(firstSendNotificationCallArgs[0]).to.equal(minimalUserFcmToken);
        expect(firstSendNotificationCallArgs[1]).to.equal(
          `New Message about ${FirebaseTest.getTestUserListingOne().title}`);
        expect(firstSendNotificationCallArgs[2]).to.equal(
          `${testUserDisplayName}: ${testMessage.text}`);
        expect(resolve.called, 'Should call resolveTask').to.equal(true);
        expect(progress.called, 'Should not call progress').to.equal(false);
        expect(reject.called, 'Should not call reject').to.equal(false);
      })
      .then(done)
      .catch(done);
  });
});
