# Slack Bot

## Getting Started

### Installation

- Clone or download this repository.
- Ensure Node 18.13.0 or above is installed *(NVM users can run `nvm use`)*
- Run `npm i` / `npm install`

### Quick Setup

1. Create an app manifest at `./manifest.yml` — This is what will be used to create the Slack app, providing configuration for naming, scope, and more. There's a sample template available at `./sample/manifest.yml`.
1. Set `SLACK_CONFIG_ACCESS_TOKEN` in .env ([environment variables](#environment-variables))
1. Run `npm run build` and follow the prompts via the CLI.
1. Install your App to your workspace.
1. Set `SLACK_BOT_ACCESS_TOKEN` in .env ([environment variables](#environment-variables))
1. Add the Slack bot into the channel — Navigate to the channel that you'd like the Slack bot to post to and type @ followed by your bot's name. Pick your bot from the list and select **Add to Channel** from the modal.

### Environment Variables

Variable Name | Description | Where to Find
--- | --- | ---
SLACK_CONFIG_ACCESS_TOKEN | Access token for creating and updating Slack apps| These are generated [here](https://api.slack.com/apps).<br/>In the **Your App Configuration Tokens** section click the **Generate Token** button, select the relevant workspace, then click generate.<br/>Your workspace will then appear in the list. Click the **Copy** button under the **Access Token** heading to copy it to your clipboard.<br/>Please note that this will be **valid for 12 hours**, after which a new token must be obtained.
SLACK_CONFIG_REFRESH_TOKEN | Refresh token for rotating config access tokens | If you haven't already, in the **Your App Configuration Tokens** section click the **Generate Token** button, select the relevant workspace, then click generate.<br/>Your workspace will then appear in the list. Click the **Copy** button under the **Refresh Token** heading to copy it to your clipboard.<br/>Please note that this will be **valid for 12 hours**, after which a new token must be obtained.
SLACK_APP_ID | The Slack app ID | This can be found [here](https://api.slack.com/apps) once an app has been built.<br/>Navigate to your app from the list. The **App ID** is available under **App Credentials**.<br/>Alternatively, when running the `build` command you will be given the option to update this automatically.
SLACK_BOT_ACCESS_TOKEN | An OAuth token used to authenticate Slack web API requests via a bot | This can be found [here](https://api.slack.com/apps).<br/>Navigate to your app from the list and select **OAuth & Permissions** under the **Features** heading.<br/>The token will be available under the **OAuth Tokens for Your Workspace** Heading, labelled as **Bot User OAuth Token**.<br/>***Please note that your app must be installed to your workspace***
SLACK_CHANNEL_ID | The Slack channel ID to post messages to | This can be found in the Slack app.<br/>Right click on the desired channel and select **View channel details**. The channel ID should be at the bottom of the modal.


## Building & Updating Slack Apps

### Scripts
Script | Description | Requirements
--- | --- | ---
`npm run build` | Update Slack app with manifest | 

## Usage

### Example Scripts
> Example scripts for messaging are provided in `./example-scripts`.

Name | Description
--- | ---
thread-init | Post a message to a channel and save the timestamp to allow updates/replies later
thread-update | Update an existing message on a channel using a saved timestamp
thread-reply | Reply to an existing message on a channel using a saved timestamp
thread-fallback | A Node 14 compatible script to post a message on a channel
