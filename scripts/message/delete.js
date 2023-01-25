import { parseArgs } from 'node:util';
import dotenv from 'dotenv';
import deleteSlackMessage from '../../core/deleteSlackMessage.js';

dotenv.config();

/**
 * Deletes a message from a Slack channel via a Post request to the Slack web API.
 * The request is authorised via OAuth using the SLACK_BOT_ACCESS_TOKEN in our .env
 * The slack channel ID is specified in our env.
 */
(async function main() {
  console.log('Deleting message...');
  try {

    // Env check
    if (!process.env.SLACK_CHANNEL_ID) {
      throw new Error('Missing env variable: SLACK_CHANNEL_ID — Could not acquire Slack channel ID');
    }

    if (!process.env.SLACK_BOT_ACCESS_TOKEN) {
      throw new Error('Missing env variable: SLACK_BOT_ACCESS_TOKEN — Could not acquire Slack bot user access token');
    }

    /**
     * Parse timestamp from the CLI
     * The script will first look for the --timestamp (-t) flag
     * - eg. npm run message:delete -- --timestamp=1234567890
     * - eg. npm run message:delete -- -t 1234567890
     * Then use whatever argument is passed directly after the script
     * - eg. npm run message:delete 1234567890
     */
    let {
      values: {
        timestamp = process.argv[2]
      }
    } = parseArgs({
      options: {
        timestamp: {
          type: 'string',
          short: 't'
        }
      },
      strict: false
    });

    if (!timestamp) {
      throw new Error('Missing timestamp: Please pass a valid timestamp via the CLI using the --timestamp (-t) flag. Alternatively pass a timestamp as an argument immediately after the script.')
    }

    const { isSuccessful } = await deleteSlackMessage(timestamp, {
      channelId: process.env.SLACK_CHANNEL_ID,
      accessToken: process.env.SLACK_BOT_ACCESS_TOKEN
    });

    if (!isSuccessful) {
      throw new Error('An unknown error occurred: Message not deleted');
    }

    console.log('Message deleted successfully!');

  } catch (error) {
    console.error(error);
    process.exit(1);
  }

})();
