# Slack Bot

> Please note that most of below is currently outdated and should be ignored. It will be updated soon.
> ### To get started: ###
> - Clone/download this repository
> - Ensure Node 18.13.0 or above is installed (nvm users can run `nvm use`)
> - Install: `npm i`
> - Run the command `npm run init`
> - Follow the onscreen prompts

---

## Getting Started

### Installation

- Clone or download this repository.
- Ensure Node 18.13.0 or above is installed *(NVM users can run `nvm use`)*
- Run `npm i` / `npm install`

### Quick Setup

Run `npm run init` from the command line.

### Manual Setup

> A `.env` file will be required in the route directory to specify environment variables, see [dotenv](https://github.com/motdotla/dotenv#usage) for more details.

Step | Action | Description | Reference
--- | --- | --- | ---
1 | Create a Slack config access token and add the **refresh token** to your `.env` file under the property `SLACK_CONFIG_REFRESH_TOKEN` | This is used to rotate short lived OAuth2 access tokens for authorising any changes to config, eg. building and updating slack apps. | https://api.slack.com/authentication/config-tokens
2 | Create an app manifest at `./manifest.yml` | This is what will be used to create the Slack app, providing configuration for naming, scope, and more. There's a sample template available at `./sample/manifest.yml`. | https://api.slack.com/reference/manifests#manifest_apis
3 | Build a new Slack app via the command `npm run build` | This will build a new Slack app on your account, based off the values set in your build manifest | https://api.slack.com/methods/apps.manifest.create
4 | Install your app to your workspace | Slack app's need to be manually added to a workspace so that you can authorise the scopes that you specified in the manifest. This can be found in your Slack app configuration on the Slack API website | https://api.slack.com/apps
5 | Add your Slack app's bot to a channel | Slack app bots act as users and must be added to each channel that you plan them to interact with. This can be handled by navigating to the desired channel and @ing a message at the bot — Slack will ask if you would like to add them to the channel | https://docs.zowe.org/stable/user-guide/zowe-chat/chat_prerequisite_slack_invite_app_to_channel/
6 | Add the Slack channel ID to your `.env` file under the property `SLACK_CHANNEL_ID` | When interacting messages using the Slack web API to you need to specify which channel to perform any actions. This ID can found under channel details, either right click the channel in the navigation or click the channel name whilst it's open | https://app.slack.com/client
7 | Add your Slack app bot user OAuth2 token to your `.env` file under the property `SLACK_BOT_ACCESS_TOKEN` | Any requests for messaging via your Slack app's bot must be verified via OAuth2 tokens. This can be found in the OAuth & Permissions page of your Slack app configuration on the Slack API website | https://api.slack.com/apps

### Environment Variables

Variable Name | Description | Where to Find
--- | --- | ---
SLACK_CONFIG_REFRESH_TOKEN | Refresh token for rotating config access tokens | If you haven't already, in the **Your App Configuration Tokens** section click the **Generate Token** button, select the relevant workspace, then click generate.<br/>Your workspace will then appear in the list. Click the **Copy** button under the **Refresh Token** heading to copy it to your clipboard.
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
