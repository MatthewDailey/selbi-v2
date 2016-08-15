Selbi-v2
========

This is a second implementation of Selbi based on Firebase. This repo contains:

- selbi-backend: Tests covering the firebase schema and demonstrating various actions.
- selbi-stripe-worker: Node service which listens to firebase for stripe updates.

Testing
-------
All projects in this repo use mocha to test and it should be installed globally via `npm install mocha -g`.

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

Git Flow
--------
There are 2 permanant branches:
- develop - Code staged for production.
- production - Code running live.

New features are developed on a new branch titled `feature/<feature-name` which is then merged to develop. When we want to cut a release, we merge develop into production. No one should push directly to develop or production.

Any code merged to develop will be deployed to staging automatically via CircleCI, including schema changes. This means if your feature will break something until it's complete, you should be using a feature branch.

A common workflow for modifying the firebase schema will be:
- Create a feature branch.
- Login to firebase using `firebase login`
- Do changes and iterate against the `selbi-develop` instance.
- Push feature branch to github.
- Merge the feature branch to `develop`. This will then deploy your changes to staging.


