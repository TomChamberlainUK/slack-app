import { parseArgs } from 'node:util';
import dotenv from 'dotenv';
import postSlackMessage from '../../core/postSlackMessage.js';

dotenv.config();

/**
 * Sends a message to a Slack channel via a Post request to the Slack web API.
 * The request is authorised via OAuth using the SLACK_BOT_ACCESS_TOKEN in our .env
 * The slack channel ID is specified in our env.
 */
(async function main() {
  console.log('Sending message...');
  try {

    /**
     * Parse message from the CLI
     * The script will first look for the --message (-m) flag
     * - eg. npm run message -- --message="This is a message"
     * - eg. npm run message -- -m "This is a message"
     * Then use whatever argument is passed directly after the script
     * - eg. npm run message "This is a message"
     * And finally default to "Beep boop this is a test"
     */
    const {
      values: {
        message = process.argv[2] ?? 'Beep boop this is a test'
      }
    } = parseArgs({
      options: {
        message: {
          type: 'string',
          short: 'm'
        }
      },
      strict: false
    });

    const { isSuccessful, timestamp } = await postSlackMessage(message, {
      channelId: process.env.SLACK_CHANNEL_ID,
      accessToken: process.env.SLACK_BOT_ACCESS_TOKEN
    });

    if (!isSuccessful) {
      throw new Error('An unknown error occurred: Message not sent');
    }

    console.log('Message sent successfully!');
    console.log(`Timestamp: ${timestamp}`);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }

})();
