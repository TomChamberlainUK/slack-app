import fs from 'fs/promises';
import path from 'path';

/**
 * An example script for replying to a Slack thread in Node.
 * In this example we will reply to an existing Slack post using a saved timestamp (ts).
 * We'll format this message with a standard text string, instead of Slack web API's blocks object.
 * @see https://api.slack.com/methods/chat.postMessage
 */
(async function main() {
  try {

    /**
     * We'll need an OAuth access token to identify and authorise our app.
     * This can be found in the relevant app page on the Slack API website via a browser.
     * On the app page navigate to "OAuth & Permissions" under "Features".
     * @see https://api.slack.com/apps
     */
    if (!process.env.SLACK_BOT_ACCESS_TOKEN) {
      throw new Error('Missing env variable: SLACK_BOT_ACCESS_TOKEN — Could not acquire access token for slack bot');
    }

    /** 
     * We need the channel ID for the post that we're updating.
     * This can be found in the Slack app by right clicking the channel and selecting "View channel details".
     */
    if (!process.env.SLACK_CHANNEL_ID) {
      throw new Error('Missing env variable: SLACK_CHANNEL_ID — Could not acquire Slack channel ID for Slack bot');
    }

    /**
     * A timestamp (ts) is required to identify the message that we're replying to.
     * We'll retrieve the timestamp that we saved in the thread-init script via Node's file system (fs) module.
     * We'll also grab the icon emoji for DRY consistency.
     */
    const filePath = path.resolve(__dirname, '/temp/thread.json');
    const file = await fs.readFile(filePath, 'utf8');
    const { ts, iconEmoji } = JSON.parse(file);

    if (!ts) {
      throw new Error('Could not acquire timestamp to reply to thread.');
    }
    
    /**
     * We'll prepare our message as a simple string this time.
     */
    const message = 'This is a reply to a Slack thread';

    /**
     * Our reply can be sent via a POST request to the Slack web API.
     * An access token must be provided through the header.
     * The Slack channel ID and original post's timestamp (ts) must be specified in the body alongside the message.
     * @see https://api.slack.com/methods/chat.update
     */
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${process.env.SLACK_BOT_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        channel: process.env.SLACK_CHANNEL_ID,
        text: message,
        thread_ts: ts,
        icon_emoji: iconEmoji ?? 'robot_face'
      })
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(`Failed to reply to thread: ${data.error}`);
    }

  } catch (error) {
    console.error(error);
  }
})();
