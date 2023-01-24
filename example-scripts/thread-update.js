import fs from 'fs/promises';
import path from 'path';

/**
 * An example script for updating a Slack thread in Node.
 * In this example we will update an existing Slack post using a saved timestamp (ts).
 * @see https://api.slack.com/methods/chat.update
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
     * A timestamp (ts) is required to identify the message that we're updating.
     * We'll retrieve the timestamp that we saved in the thread-init script via Node's file system (fs) module.
     * We'll also grab the message's formatted blocks so that we can update specifically what we need, as well as the icon emoji for DRY consistency.
     */
    const filePath = path.resolve(__dirname, '/temp/thread.json');
    const file = await fs.readFile(filePath, 'utf8');
    const { ts, blocks, iconEmoji } = JSON.parse(file);

    if (!ts) {
      throw new Error('Could not acquire timestamp to update Slack message.');
    }

    if (!blocks) {
      throw new Error('Could not acquire blocks to update Slack message');
    }

   /**
    * For this example we just want to update the text in the last section of our blocks.
    * We can modify blocks the same way that we would any object in Javascript.
    * @see https://api.slack.com/reference/block-kit/blocks
    */
    blocks[2].text.text = '✅ — Initialised';

    /**
     * Our message can be updated via a POST request to the Slack web API.
     * An access token must be provided through the header.
     * The Slack channel ID and original post's timestamp (ts) must be specified in the body alongside the message.
     * @see https://api.slack.com/methods/chat.update
     */
    const response = await fetch('https://slack.com/api/chat.update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${process.env.SLACK_BOT_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        channel: process.env.SLACK_CHANNEL_ID,
        icon_emoji: iconEmoji ?? 'robot_face',
        ts,
        blocks
      })
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(`Message failed to update: ${data.error}`);
    }

  } catch (error) {
    console.error(error);
  }
})();
