import { parseArgs } from 'node:util';
import dotenv from 'dotenv';
import replyToSlackMessage from '../../core/replyToSlackMessage.js';

dotenv.config();

/**
 * Sends a message to a Slack channel via a Post request to the Slack web API.
 * The request is authorised via OAuth using the SLACK_BOT_ACCESS_TOKEN in our .env
 * The slack channel ID is specified in our env.
 */
(async function main() {
  console.log('Sending Reply...');
  try {

    // Env check
    if (!process.env.SLACK_CHANNEL_ID) {
      throw new Error('Missing env variable: SLACK_CHANNEL_ID — Could not acquire Slack channel ID');
    }

    if (!process.env.SLACK_BOT_ACCESS_TOKEN) {
      throw new Error('Missing env variable: SLACK_BOT_ACCESS_TOKEN — Could not acquire Slack bot user access token');
    }

    /**
     * Parse message and timestamp from the CLI
     * The script will look for the --message (-m) and --timestamp (-t) flags
     * - eg. npm run message:reply -- --message="This is a message" --timestamp=1234567890
     * - eg. npm run message:reply -- -m "This is a message" -t 1234567890
     * Message will default to "Beep boop this is a test"
     */
    const {
      values: {
        message = 'Beep boop this is a test',
        timestamp
      }
    } = parseArgs({
      options: {
        message: {
          type: 'string',
          short: 'm'
        },
        timestamp: {
          type: 'string',
          short: 't'
        }
      }
    });

    if (!timestamp) {
      throw new Error('Missing timestamp: Please pass a valid timestamp via the CLI using the --timestamp (-t) flag');
    }

    const { isSuccessful, timestamp: replyTimestamp } = await replyToSlackMessage(message, {
      timestamp,
      channelId: process.env.SLACK_CHANNEL_ID,
      accessToken: process.env.SLACK_BOT_ACCESS_TOKEN
    });

    if (!isSuccessful) {
      throw new Error('An unknown error occurred: Reply not sent');
    }

    console.log('Reply sent successfully!');
    console.log(`Timestamp: ${replyTimestamp}`);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }

})();
