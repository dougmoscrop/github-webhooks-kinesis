# github-webhooks-kinesis

This is a simple API that accepts Webhooks from GitHub and sends them to Kinesis

## Usage

It's pretty easy! Follow the steps below after cloning this repository.

### Generate secret

(generate a secret somehow)

### Deploy this service

- `npm run deploy -- --secret={your-secret-here}`
- Note the endpoint URL

### Set up GitHub Webhook

- Go in to Settings for either a Repository or an Organization
- Choose Webhooks on the left
- Add a Webhook:
  - Specify the secret from the first step as well as the endpoint URL from the previous step
  - Choose the granularity of events you want to receive, etc.
