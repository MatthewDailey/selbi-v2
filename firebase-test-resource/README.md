firebase-test-resource
======================

This project is a private npm module accessible from `@selbi/firebase-test-resource`. It's purpose is to share common test tools for connecting to Firebase for integration tests.

Usage
-----

To import use `import FirebaseTest from '@selbi/firebase-test-resource'.

The package provides 3 sample users for to test for various interactions. Two of those users have firebase app connections, the third is simply there for convenience.

The package also provides access to a service account firebase app which is used to simulate a server connection.

API:
-`FirebaseTest.minimalUserUid` - uid for the minimal user, has a firebase connection.
-`FirebaseTest.testUserUid` - uid for the test user, has a firebase connection.
-`FirebaseTest.extraUserUid` - uid for the extra user.
-`FirebaseTest.minimalUserApp` - firebaseApp logged in as minimalUser.
-`FirebaseTest.testUserApp` - firebaseApp logged in as testUser.
-`FirebaseTest.serviceAccountApp` - firebaseApp logged in as a service account.
-`FirebaseTest.dropDatabase()` - drops the entire db and returns a `Promise` which is fulfilled when drop is complete. Useful for pre-suite cleanup. Consider using the `serviceAccountApp` for more fine grained cleanup.
-`FirebaseTest.createMinimalUser()` - Creates the data for minimalUser in the db. Useful for set when testing an aspect of the schema that requires a user be present (eg. Listings).

In addition there are accessors for various bits of json data you might want:
- `getMinimalUserData()` - Get user data for minimal user.
- `getTestUserData()` - Get user data for test user.
- `getTestUserListingOne()` - Listing data for minimal user.
- `getMinimalUserListingOne()` - Listing data for minimal user.
- `getMinimalUserListingTwo()` - Listing data for minimal user.
- `getUserListingPartial()` - Minimal listing data a user can write.
- `getUserListingCompleteForUser()` - User listing with everything a user can write.
- `getUserListingComplete()` - User listing with everything that could be on it (including data only service account can write).
