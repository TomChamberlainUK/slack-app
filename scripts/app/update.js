import dotenv from 'dotenv';
import rotateSlackConfigToken from '../../core/rotateSlackConfigToken.js';
import updateSlackApp from '../../core/updateSlackApp.js';
import loadYmlFile from '../../utils/loadYmlFile.js';
import setEnvValue from '../../utils/setEnvValue.js';

dotenv.config();

/** 
 * Builds a Slack app using a local manifest.yml file via the Slack web API.
 */
(async function main() {
  try {

    console.log(`Updating app...`);

    // Env check
    if (!process.env.SLACK_CONFIG_REFRESH_TOKEN) {
      throw new Error('Missing env variable: SLACK_CONFIG_REFRESH_TOKEN — Could not acquire Slack refresh token to obtain access token access token');
    }

    if (!process.env.SLACK_APP_ID) {
      throw new Error('Missing env variable: SLACK_APP_ID — Could not acquire Slack app ID for updating');
    }

    // Load local manifest.yml file and parse into a Javascript object.
    const manifest = await loadYmlFile('./manifest.yml');

    // Get a new valid access token using refresh token
    const { accessToken, refreshToken } = await rotateSlackConfigToken(process.env.SLACK_CONFIG_REFRESH_TOKEN);

    // Update existing refresh token
    await setEnvValue('SLACK_CONFIG_REFRESH_TOKEN', refreshToken);

    // Update slack app via web API
    const { isSuccessful } = await updateSlackApp(process.env.SLACK_APP_ID, manifest, accessToken);

    if (!isSuccessful) {
      throw new Error('Unknown error whilst updating app')
    }

    console.log(`App updated successfully!`);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();