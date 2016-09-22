Selbi - Mobile App
==================

This package implements the Selbi mobile app in React Native

Build Process
-------------

To build and run against various Selbi stages (see `../README.md` for details), we use an additional
build phase to run a script which sets up the necessary components.

Peices that require custom configuration:
- FCM and Firebase Analytics - This requires the proper `GoogleService-Info.plist` in place at
`ios/Selbi/GoogleService-Info.plist`. These are stored in `ios/Selbi/selbiBuildResources` and copied
 into place at build time.
- Firebase Realtime DB connection - We use [react-native-config](https://github.com/luggit/react-native-config)
to manage JS configuration including the Realtime DB connection info. Since we access this directly
from javascript, we use seperate management from the iOS firebase info.

Probably the right long term solution is to write a native module which holds firebase endpoints
and then provides them to JS to remove the duplicate config instances.

Schemes
-------
We use schemes in XCode to manage deploying different version of the app.

- 'Selbi Develop' - builds the develop version, communicating with selbi-develop.
- 'Selbi Staging' - builds the staging version, communicating with selbi-staging.
- 'Selbi Production' - builds the production version, communicating with selbi-production.

These can be built and deployed directly to test flight via `fastlane staging`.


Hot Updates
-----------

For hot patching, we use [Code Push](https://microsoft.github.io/code-push/). To use this, you
must install the code push cli.

To push a JS-only update:
- Go to `Selbi/`
- Run `code-push release-react selbi ios -d <selbi stage> -m`. The stage is something like 'develop'
or 'staging'. The `-m` means the update is mandatory.

To test with test flight the steps are:
- Go to `Selbi/ios`
- Run `fastlane staging`. This will increment the build number and publish the app to test flight.

[Deprecated] To test with test flight the steps are:
- 0. Update build number and/or version in the Selbi 'General' header in XCode. As we iterate, we should
only be updating the build number. Only update the version number for a new release.
- 1. Set scheme to 'Staging'
- 2. From `<repo root>/Selbi` run `cp Selbi/selbiBuildResources/stating/.env .`
- 3. In XCode go to `Product` menu and hit `Archive`. This will build the archive and open the archive
manager.
- 4. Select the new version and click `Upload to App Store...`.
- 5. Visit the [Itunes Connect Activity page](https://itunesconnect.apple.com/WebObjects/iTunesConnect.woa/ra/ng/app/1156524902/activity/ios/builds)
 and monitor to progress of the upload.
- 6. Once the build upload is complete, go to the [Internal Testing](https://itunesconnect.apple.com/WebObjects/iTunesConnect.woa/ra/ng/app/1156524902/testflight/internal)
tab to choose a test version and notify testers.

Testing
-------

We use [enzyme](https://github.com/airbnb/enzyme) with the
[enzyme react-native](https://github.com/airbnb/enzyme/blob/master/docs/guides/react-native.md) add
on along with [mocha](https://mochajs.org/). Basically we're copying Airbnb's stack.

To install deps:
- `npm i --save-dev enzyme`
- `npm i --save-dev react-addons-test-utils`
- `npm i --save-dev react-dom`

In addition, to transpile React Native modules for test, it's important that you run `mocha` with
the `--require tests/setup.js`. The `node_modules` to transpile are listed in `modulesToCompile`.

This is cheifly necessary for the `react-native-material-kit` dependency.

Redux
-----
To manage data in a complex application we use
[Redux](http://redux.js.org/docs/introduction/index.html).


Immutability
------------
Immutability makes it easy to reason about complex logic in a large application. To enforce
immutable data throughout the application we use
[Immutable.js](https://facebook.github.io/immutable-js/)

Styling
-------
For styling we use Material Design cus it's hella fresh.

- [react-native-material-kit](https://github.com/xinthink/react-native-material-kit)

For icons we use [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons).


Useful links
------------
- [React Reusble Components](https://facebook.github.io/react/docs/reusable-components.html) -
Includes info about property validation.