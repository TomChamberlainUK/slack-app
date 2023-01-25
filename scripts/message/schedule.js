import { parseArgs } from 'node:util';
import dotenv from 'dotenv';
import scheduleSlackMessage from '../../core/scheduleSlackMessage.js';
import getHumanReadableDateFromUnixTimestamp from '../../utils/getHumanReadableDateFromUnixTimestamp.js';

dotenv.config();

/**
 * Updates a message on a Slack channel via a Post request to the Slack web API.
 * The request is authorised via OAuth using the SLACK_BOT_ACCESS_TOKEN in our .env
 * The slack channel ID is specified in our env.
 */
(async function main() {
  console.log('Scheduling message...');
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
     * - eg. npm run message:schedule -- --message="This is a message" --timestamp=1234567890
     * - eg. npm run message:schedule -- -m "This is a message" -t 1234567890
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

    const { isSuccessful } = await scheduleSlackMessage(message, {
      timestamp,
      channelId: process.env.SLACK_CHANNEL_ID,
      accessToken: process.env.SLACK_BOT_ACCESS_TOKEN
    });

    if (!isSuccessful) {
      throw new Error('An unknown error occurred: Message not scheduled');
    }

    console.log('Message scheduled successfully!');
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Date: ${getHumanReadableDateFromUnixTimestamp(timestamp)}`);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }

})();
