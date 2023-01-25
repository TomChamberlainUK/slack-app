import { Interface } from 'readline/promises';
import dotenv from 'dotenv';
import rotateSlackConfigToken from '../../core/rotateSlackConfigToken.js';
import buildSlackApp from '../../core/buildSlackApp.js';
import loadYmlFile from '../../utils/loadYmlFile.js';
import setEnvValue from '../../utils/setEnvValue.js';

dotenv.config();

/** 
 * Builds a Slack app using a local manifest.yml file via the Slack web API.
 */
(async function main() {
  try {

    console.log(`Building app...`);

    // Env check
    if (!process.env.SLACK_CONFIG_REFRESH_TOKEN) {
      throw new Error('Missing env variable: SLACK_CONFIG_REFRESH_TOKEN — Could not acquire Slack refresh token to obtain access token access token');
    }

    // Load local manifest.yml file and parse into a Javascript object.
    const manifest = await loadYmlFile('./manifest.yml');

    // Get a new valid access token using refresh token
    const { accessToken, refreshToken } = await rotateSlackConfigToken(process.env.SLACK_CONFIG_REFRESH_TOKEN);

    // Update existing refresh token
    await setEnvValue('SLACK_CONFIG_REFRESH_TOKEN', refreshToken);

    // Build slack app via web API
    const { isSuccessful, appId } = await buildSlackApp(manifest, accessToken);

    if (!isSuccessful) {
      throw new Error('Unknown error whilst building app');
    }

    console.log(`App built successfully!`);

    // Take user input on whether to update .env file
    const rl = new Interface({ input: process.stdin, output: process.stdout });
    const answer = await rl.question(`App ID is ${appId}, would you like the .env file updating? (y/n): `);
    rl.close();

    // Update .env if applicable
    if (answer.toLowerCase() === 'y') {
      console.log('Updating env file...');
      await setEnvValue('SLACK_APP_ID', appId);
    }

    console.log(`Install to your workspace here https://api.slack.com/apps/${appId}/oauth`);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();