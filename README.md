Selbi-v2

This is a second implementation of Selbi based on firebase. This repo contains:

- selbi-backend: Tests covering the firebase schema and demonstrating various actions.
- selbi-stripe-worker: Node service which listens to firebase for stripe updates.

Git Flow
--------
There are 2 permanant branches:
- develop - Code staged for production.
- master - Code running live.

New features are developed on a new branch titled `feature/<feature-name` which is then merged to develop. When we want to cut a release, we merge develop into master. No one should push directly to develop or master.

