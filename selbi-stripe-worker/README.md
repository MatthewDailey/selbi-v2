selbi-stripe-worker
===================

This is the Selbi backend service. It listens to various queues in Firebase and takes action based
on the queue events.

Easy Deployment
---------------
Use the `deploy` script to deploy this project. Run `./deploy -h` for instructions. If the script
doesn't seem to work checkout the section below.


Background on Deploying Microservices to Google App Engine
--------------------------------------------
The backend services and future web frontend are deployed as NodeJS applications running on Google App Engine.

These are deployed via the [Google Cloud SDK](https://cloud.google.com/sdk/docs/quickstart-mac-os-x?authuser=0). The `gcloud app` tool is used for managing and deploying services. Try `gcloud app services list` to list all running services.

Useful commands:
- `gcloud config set project selbi-production` Change the local working project.
- `gcloud auth activate-service-account --key-file ../service-accounts/selbi-production-service-account.json` Change the account to work in.
- `gcloud app deploy app.yaml -q` Deploy the app.

Configuration docs:
- https://cloud.google.com/appengine/docs/python/config/appref