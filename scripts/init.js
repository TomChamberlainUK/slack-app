import { writeFile } from 'fs/promises';
import { Interface } from 'readline/promises';
import dotenv from 'dotenv';
import setEnvValue from '../utils/setEnvValue.js';
import loadYmlFile from '../utils/loadYmlFile.js';
import rotateSlackConfigToken from '../core/rotateSlackConfigToken.js';
import buildSlackApp from '../core/buildSlackApp.js';
import postSlackMessage from '../core/postSlackMessage.js';
import deleteSlackMessage from '../core/deleteSlackMessage.js';

(async function main() {

  try {

    // Prepare an interface for user input
    const rl = new Interface({ input: process.stdin, output: process.stdout });

    // Welcome
    console.log('Welcome to the Slack app initializer!');
    console.log('This script will walk you through building a Slack app and corresponding bot, and get them set up on your workspace.');
    console.log('---');

    const initialConfirmation = await rl.question('We\'ll require some user input to complete, you can press enter to continue, or at any point enter "exit" to exit: ');
    console.log('---');

    if (initialConfirmation.toLowerCase() === 'exit') {
      console.log('Exitting...');
      process.exit(1);
    }

    // Acquire configuration tokens
    console.log('The first step is to handle authorisation for Slack app configuration. This will be handled via OAuth2 access tokens.');
    console.log('As these are short lived (12 hours), we\'ll use a refresh token that can handle token rotation.');
    console.log('These can be found here https://api.slack.com/apps');
    console.log('Under the "Your App Configuration Tokens" heading, click the "Generate Token" button.');
    console.log('Select the relevant workspace from the list and then Generate.');
    console.log('Your workspace will now appear in the list, select "Copy" under "Refresh Token" to copy it to your clipboard');
    console.log('---');

    let refreshToken = await rl.question('Enter your refresh token into this terminal to continue (or press enter if you have already set this up): ');
    console.log('---');

    if (refreshToken.toLowerCase() === 'exit') {
      console.log('Exitting...');
      process.exit(1);
    }

    if (refreshToken) {
      // Create .env file if it doesn't exist, then add/set SLACK_CONFIG_REFRESH_TOKEN value
      try {
        await writeFile('./.env', '', { flag: 'wx' });
      } finally {
        await setEnvValue('SLACK_CONFIG_REFRESH_TOKEN', refreshToken);
      }
    }

    // Prepare Manifest
    console.log('Next we\'ll need to make a build manifest in the root directory. We\'ll format this as a .yml file');
    console.log('There is a sample available at "./sample.manifest.yml", copy this and save it under the root directory as "./manifest.yml"');
    console.log('This sample has simple scopes to write messages from a bot and customize how that bot appears in Slack. You can edit the manifest as suits your needs.');
    console.log('Further documentation for writing a build manifest is available here: https://api.slack.com/reference/manifests');
    console.log('---');

    const manifestConfirmation = await rl.question(`Once your manifest is ready, press enter to continue: `);
    console.log('---');

    if (manifestConfirmation.toLowerCase() === 'exit') {
      console.log('Exitting...');
      process.exit(1);
    }

    const manifest = await loadYmlFile('./manifest.yml');

    // Building app
    console.log('Now we\'ll send a request to the Slack web API to get your Slack app built using the provided manifest.');
    console.log('First we\'ll acquire an access token using the refresh token we got earlier.');
    console.log('This will also provide us with a new refresh token — we\'ll save this in our .env file for future use.');
    console.log('---');

    const buildConfirmation = await rl.question(`Press enter to continue: `);
    console.log('---');

    if (buildConfirmation.toLowerCase() === 'exit') {
      console.log('Exitting...');
      process.exit(1);
    }

    // Get a new valid access token using refresh token
    const { accessToken, refreshToken: newRefreshToken } = await rotateSlackConfigToken(refreshToken);
    await setEnvValue('SLACK_CONFIG_REFRESH_TOKEN', newRefreshToken);

    // Build app
    console.log('Building app...');
    const { isSuccessful: buildIsSuccessful, appId } = await buildSlackApp(manifest, accessToken);

    if (!buildIsSuccessful) {
      throw new Error('Unknown error whilst building app');
    }

    console.log(`App built successfully! The app ID is ${appId}.`);
    console.log('We\'ll save this in your .env for future use.');
    console.log('---');

    await setEnvValue('SLACK_APP_ID', appId);

    // Install to workspace
    console.log(`Now we'll need to install the new app to your workspace, this can be done here https://api.slack.com/apps/${appId}/`);
    console.log('Under the "Building Apps for Slack" heading, there\'s a subheading for "Install your app", select the "Install to Workspace" button here.');
    console.log('You\'ll see a rundown of permissions that you specified in your manifest. Review these and select allow.');
    console.log('---');

    const workspaceConfirmation = await rl.question('Once this step has been completed press enter to continue: ');
    console.log('---');

    if (workspaceConfirmation.toLowerCase() === 'exit') {
      console.log('Exitting...');
      process.exit(1);
    }

    // Add bot to channel
    console.log('Now we\'ll just need to configure a channel for your app\'s bot to post into.');
    console.log('First, navigate to the Slack channel within the workspace that you\'d like to post to.');
    console.log('Type @ followed by your bot\'s name in the message and hit send.');
    console.log('A modal will pop up asking if you\'d like to add the bot to the channel, select the "Add to Channel" button.');
    console.log('---');

    const addToChannelConfirmation = await rl.question('Once this step has been completed press enter to continue: ');
    console.log('---');

    if (addToChannelConfirmation.toLowerCase() === 'exit') {
      console.log('Exitting...');
      process.exit(1);
    }

    // Get channel ID
    console.log('Now we need the channel ID for where we want to start posting.');
    console.log('Either navigate to the desired channel and click the channel\'s name at the top, or right click the channel in the Slack navigation and select "View channel details".');
    console.log('Scroll to the bottom of the modal that shows and copy the Channel ID from there');
    console.log('---');

    const channelId = await rl.question('Enter the channel ID here to continue (or press enter if you have already set this up): ');
    console.log('---');

    if (channelId.toLowerCase() === 'exit') {
      console.log('Exitting...');
      process.exit(1);
    }

    if (channelId) {
      await setEnvValue('SLACK_CHANNEL_ID', channelId);
    }

    // Get bot access token
    console.log('Finally we need an OAuth2 bot user token.');
    console.log('We\'ll use this to authorise POST HTTP requests to the Slack web API that instruct our bot to message our Slack channel.');
    console.log(`This can be found here: https://api.slack.com/apps/${appId}/oauth?`);
    console.log('Under the "OAuth Tokens for your Workspace" header will be a Bot User OAuth Token — we\'ll save this in our .env file for future use.');
    console.log('---');

    const botAccessToken = await rl.question('Enter the bot user oauth token here: ');
    console.log('---');

    if (botAccessToken.toLowerCase() === 'exit') {
      console.log('Exitting...');
      process.exit(1);
    }

    await setEnvValue('SLACK_BOT_ACCESS_TOKEN', botAccessToken);

    // Send test message
    const testMessageConfirmation = await rl.question('If you would like to send a test message to see if everything is working, enter y now, else just press enter (y): ');
    console.log('---');

    switch (testMessageConfirmation.toLowerCase()) {
      case ('exit'): {
        console.log('Exitting...');
        process.exit(1);
        break;
      }

      case ('y'): {
        // Load env file now all values have been set
        dotenv.config();

        const message = 'Beep boop, Hello World! 🤖';

        const { isSuccessful: messageSentSuccessfully, timestamp } = await postSlackMessage(message, {
          channelId: process.env.SLACK_CHANNEL_ID,
          accessToken: process.env.SLACK_BOT_ACCESS_TOKEN
        });

        if (!messageSentSuccessfully) {
          throw new Error('An unknown error occurred: Message not sent');
        }

        console.log('Message sent successfully! Check it out in your channel now.');
        console.log(`The message was sent with the timestamp of: ${timestamp}.`);
        console.log('We can use this to delete/update/reply to the message.');
        console.log('---');

        // Delete message
        const deleteMessageConfirmation = await rl.question('If you would like to delete the message now, enter y now, else just press enter (y): ');
        console.log('---');

        switch (deleteMessageConfirmation.toLowerCase()) {
          case ('exit'): {
            console.log('Exitting...');
            process.exit(1);
            break;
          }

          case ('y'): {
            const { isSuccessful: messageDeletedSuccessfully } = await deleteSlackMessage(timestamp, {
              channelId: process.env.SLACK_CHANNEL_ID,
              accessToken: process.env.SLACK_BOT_ACCESS_TOKEN
            });
    
            if (!messageDeletedSuccessfully) {
              throw new Error('An unknown error occurred: Message not deleted');
            }
    
            console.log('Message deleted successfully.');
            console.log('---');
            break;
          }
        }

        break;
      }
    }

    // Log pertinent app data
    console.log('Everything should be set up and ready for use now!');
    console.log('Here are the values for the properties that we just set in your .env:');
    console.log(`SLACK_CONFIG_REFRESH_TOKEN: ${process.env.SLACK_CONFIG_REFRESH_TOKEN}`);
    console.log(`SLACK_APP_ID: ${process.env.SLACK_APP_ID}`);
    console.log(`SLACK_CHANNEL_ID: ${process.env.SLACK_CHANNEL_ID}`);
    console.log(`SLACK_BOT_ACCESS_TOKEN: ${process.env.SLACK_BOT_ACCESS_TOKEN}`);

    // Close console interface
    rl.close();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }

})();