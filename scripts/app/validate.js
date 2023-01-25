import dotenv from 'dotenv';
import rotateSlackConfigToken from '../../core/rotateSlackConfigToken.js';
import validateSlackAppManifest from '../../core/validateSlackAppManifest.js';
import loadYmlFile from '../../utils/loadYmlFile.js';
import setEnvValue from '../../utils/setEnvValue.js';

dotenv.config();

/** 
 * Validates a local manifest.yml file.
 * @see https://api.slack.com/reference/manifests
 */
(async function main() {  
  try {
    
    console.log('Validating manifest...');

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

    // Validate manifest via Slack web API
    const isValid = await validateSlackAppManifest(manifest, accessToken);

    if (!isValid) {
      throw new Error('Unknown error whilst validating manifest')
    }

    console.log('Manifest is valid!');

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();