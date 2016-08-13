Selbi-v2

This is a second implementation of Selbi based on firebase. This repo contains:

- selbi-backend: Tests covering the firebase schema and demonstrating various actions.
- selbi-stripe-worker: Node service which listens to firebase for stripe updates.

Testing
-------
All projects in this repo use mocha to test and it should be installed globally via `npm install mocha -g`.

Firebase
--------
The Selbi backend is powered by Firebase. You should install `npm install firebase-tools -g` for easy CLI tools.

There are 3 Selbi Firebase environments (and consequently Google Cloud environments):
- selbi-develop - Unit tests run against this instance. Note multiple running unit tests may clobber each other. This is tech debt we'll need to pay off.
- selbi-staging - A full instance of Selbi including backend services.
- selbi-production - The production Selbi stack.

Git Flow
--------
There are 2 permanant branches:
- develop - Code staged for production.
- master - Code running live.

New features are developed on a new branch titled `feature/<feature-name` which is then merged to develop. When we want to cut a release, we merge develop into master. No one should push directly to develop or master.

Any code merged to develop will be deployed to staging automatically via CircleCI, including schema changes. This means if your feature will break something until it's complete, you should be using a feature branch.


