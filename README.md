Selbi-v2
========

This is a second implementation of Selbi based on Firebase. This repo contains:

- selbi-backend: Tests covering the firebase schema and demonstrating various actions.
- selbi-stripe-worker: Node service which listens to firebase for stripe updates.

Getting Started
---------------

1. Make sure you have necessary local libraries installed:
  - firebase-tools `npm install -g firebase-tools`
  - mocha (for unit tests) `npm install -g mocha`

2. Clone this repo `git clone git@github.com:MatthewDailey/selbi-v2.git`

3. Run `npm install` in the project dirs you're working in.

4. Run `pod install` in `selbi-v2/Selbi/ios` to install iOS dependencies.

5. From the repo root run `cp -r Selbi/ios/FacebookSDK ~/Documents/FacebookSDK` to install Facebook SDK dependency.

4. Set up your own development Firebase instance. Local configuration will be stored in `~/.selbirc`
  - Open the [Firebase console](https://console.firebase.google.com/)
  - Create a new project called `<your nam>-selbi-test`.
  - Click 'Add Firebase to your web app', it should open a modal with a Firebase config json.
  - Copy the `config` json object in to `~/.selbirc` as the `firebasePublicConfig`. Eg.
    ```
    ~/.selbirc
    {
        "firebasePublicConfig": {
          "apiKey": "AIzaSyAJZv8E2eLE2ko9j4pAwDVuY2itPiD2lxA",
          "authDomain": "matt-selbi-test.firebaseapp.com",
          "databaseURL": "https://matt-selbi-test.firebaseio.com",
          "storageBucket": "matt-selbi-test.appspot.com",
          "messagingSenderId": "997177106323"
        }
    }
    ```
  - Open the Permissions page for your project by clicking the gear icon in the top left next the project name.
  - Expand the left side menu and click on 'Service Accounts'
  - Click 'Create Service Account' to create a service account named 'test service account'. Make sure to assign it the role 'Owner' and select 'Furnish new private key' as a json file.
  - Copy the contents of the downloaded json file into a `firebaseServiceAccount` parameter in `~/.selbirc`. Eg.
  ```
  ~/.selbirc
      {
          "firebasePublicConfig": ...
          "firebaseServiceAccount": {
              "type": "service_account",
              "project_id": "matt-selbi-test",
              "private_key_id": "SOMEHASH",
              "private_key": "-----BEGIN PRIVATE KEY-----\nSOMEHASH\n-----END PRIVATE KEY-----\n",
              "client_email": "test-service-account@matt-selbi-test.iam.gserviceaccount.com",
              "client_id": "100330410578482047362",
              "auth_uri": "https://accounts.google.com/o/oauth2/auth",
              "token_uri": "https://accounts.google.com/o/oauth2/token",
              "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
              "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/test-service-account%40matt-selbi-test.iam.gserviceaccount.com"
          }
      }
  ```
  *CHECKPOINT You should be able to run `./deploy <yourname>-selbi-test` from `selbi-backend` to deploy the schema to your dev Firebase instance and
   run `npm test` against that instance.*
  - In the Firebase console, click 'Authentication' on the left navbar and then choose the 'Sign-in Method' tab. From there, enable Email/Password and Facebook authentication. You can use the Facebook App ID and App secret from `selbi-develop`.
6. Set up your Selbi app to run against your individual Firebase instance.
  - In the Firebase Console, open you project `<yourname>-selbi-test` and click 'Add Firebase to your iOS app'
    - Step 1, enter bundle id `io.selbi.app` and put a nickname if you like.
    - Step 2, save the `GoogleService-Info.plist` file you are prompted to download to `selbi-v2/Selbi/ios/Selbi/selbiBuildResources/individual`
    - You can ignore steps 3 and 4 because they have already been completed for you.
  - Use the values in `~/.selbirc` to fill in the values in `selbi-v2/Selbi/ios/selbiBuildResources/individual/config.js`

  *CHECKPOINT You should be able to run `./runSimulator.sh` from `Selbi` and it will launch a simulator
  connected to your individual Firebase instance. Try watching the Firebase console database view as
  you sign in to verify the connection is correct.*
5. Enable FCM notifications.
  - In Firebase console, click the gear to 'Project Settings' then go to the 'Cloud Messaging' tab.
  - Upload `selbi-v2/Selbi/appleCerts/octoberPushDistributionPrivateKey.p12` with no password as both the
    production and development APNS certificates.
  - Copy the 'Server Key' and put it in your `~/.selbirc` under `fcmConfig.serverKey`
  ```
    ~/.selbirc
        {
            "firebasePublicConfig": ...
            "firebaseServiceAccount": ...
            "fcmConfig" : {
              "serverKey": "AIzaSyAO0bh1DI5VOlePU2SWOHyfjAUE85VljrU"
            }
        }
    ```
    *CHECKPOINT You should be able to run the backend service from `selbi-stripe-work` with `npm start`,
    run the 'Selbi Individual' scheme on your device from XCode and start a simulator from `./runSimulator`.
    If you post a listing from the physical device then close the app then send a message about that listing
    from another user on the simulator and get a notification.*

In order to make managing individual selbi instances easy, we've made some simplifications:
- It doesn't support crash reporting.
- It uses the develop stage deeplink urls.



Testing
-------
All projects in this repo use mocha to test and it should be installed globally via `npm install mocha -g

To execute tests (and code in general), you'll need to include the ES6 compiler Babel. To do this add `--compilers js:babel-core/register` as an argument.

You should be able to run all the tests in a project via `npm test`.

Firebase and Google Cloud
-------------------------
The Selbi backend is powered by Firebase. You should install `npm install firebase-tools -g` for easy CLI tools.

There are 3 Selbi Firebase environments (and consequently Google Cloud environments):
- [selbi-develop](https://console.cloud.google.com/home/dashboard?project=selbi-develop) - Unit tests run against this instance. Note multiple running unit tests may clobber each other. This is tech debt we'll need to pay off.
- [selbi-staging](https://console.cloud.google.com/home/dashboard?project=selbi-staging) - A full instance of Selbi including backend services.
- [selbi-production](https://console.cloud.google.com/home/dashboard?project=selbi-production) - The production Selbi stack.

The `service-accounts` directory contains service accounts which can be used to programmatically modify each of these
Firebase / Google Cloud deployments. This is useful for integration testing and for continuous deployment.

Note that Google app engine assumes any app deployed will serve an http endpoint on port 8080. If nothing is served at port 8080, then App Engine will assume something is wrong, delete the box and restart new one every 10 min resulting in 1 min of downtime. Therefore, even services such as stripe-worker depend on express and serve a basic status message.

Deploying Microservices to Google App Engine
--------------------------------------------
The backend services and future web frontend are deployed as NodeJS applications running on Google App Engine.

These are deployed via the [Google Cloud SDK](https://cloud.google.com/sdk/docs/quickstart-mac-os-x?authuser=0). The `gcloud app` tool is used for managing and deploying services. Try `gcloud app services list` to list all running services.

Useful commands:
- `gcloud config set project selbi-production` Change the local working project.
- `gcloud auth activate-service-account --key-file ../service-accounts/selbi-production-service-account.json` Change the account to work in.
- `gcloud app deploy app.yaml -q` Deploy the app.

Configuration docs:
- https://cloud.google.com/appengine/docs/python/config/appref

Private NPM Packages
--------------------

Selbi makes use of private NPM packages to improve the modularity of our code base. To use these modules you will need to create an [NPM account](https://www.npmjs.com/) and join the Selbi team.

You will then need to run `npm login` on your dev machine. This will generate a `~/.npmrc` file which contains an NPM token. You should add this token to you environment as an environment variable `NPM_TOKEN`. This will enable the Selbi projects which require private packages to properly authenitcate you. Read [this page](https://docs.npmjs.com/private-modules/intro) if you want more details.

Read [this explanation](http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules) on how to the continuous integration system works with private modules.

Git Flow
--------
There are 3 permanant branches which mirror our 3 Google Cloud environments:
- develop - Place where new code gets merged.
- staging - Fully live test environment.
- production - Code running live.

New features are developed on a new branch titled `feature/<feature-name>` which is then merged to develop. When we want to cut a release, we merge develop into staging and then to production. Staging and production are protected branches so no one can push directly and all builds on develop must be passing on CircleCI to merge.

CircleCI will run unit tests for any branch pushed to the repo which should take around 5 min to run per push. When merging to staging and production, CircleCI will deploy to staging and produciton automatically, including schema changes. This means if your feature will break something until it's complete, you should be using a feature branch.

A common workflow for modifying the firebase schema will be:
- Create a feature branch.
- Login to firebase using `firebase login`
- Do changes and iterate against the `selbi-develop` instance.
- Push feature branch to github.
- Merge the feature branch to `develop`. This will then deploy your changes to staging.


ESLint
------
This project makes use of ESLint to improve code quality. The advised set up is Intellij Ultimate
Edition with the ESLint plugin. There are several script in the root which will help you get
set up.

- `initNodeProject.sh` - This is useful if you are creating a new node package that other Selbi
projects will depend on. Calls the other two scripts.
- `installTestES6Deps.sh` - This will install mocha and various ES6 dependencies into an existing
node project. It's recommended to also install these deps globally for an easier life (eg intellij
will be able to find mocha and ESLint in your global npm rather than in each project so set up is
slightly easier).
- `printIntellijSetupInstructions.sh` - Tells you how to set up intellij for ES6.