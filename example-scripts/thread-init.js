import fs from 'fs/promises';
import path from 'path';

/** 
 * An example script for initialising a new Slack thread in Node.
 * In this example we will post a message to a specified channel.
 * We'll then save the timestamp, amongst other things, from the response so that we can update or reply to the thread later.
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
      throw new Error('Missing env variable: SLACK_BOT_ACCESS_TOKEN — Could not acquire access token for Slack bot');
    }

    /** 
     * We need a channel ID to post to.
     * This can be found in the Slack app by right clicking the channel and selecting "View channel details".
     */
    if (!process.env.SLACK_CHANNEL_ID) {
      throw new Error('Missing env variable: SLACK_CHANNEL_ID — Could not acquire Slack channel ID for Slack bot');
    }

    /**
     * We'll prepare our message using blocks.
     * Blocks are an object based formatting system used by the Slack web API.
     * The text itself is formatted through a flavour of Markdown called mrkdwn.
     * @see https://api.slack.com/reference/block-kit/blocks
     * @see https://api.slack.com/reference/surfaces/formatting#basics
     */
    const blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: escapeSpecialCharacters('*This is a Slack message sent from a bot*')
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: escapeSpecialCharacters('⏳ — Initialising...')
        }
      }
    ];

    /**
     * We can specify an icon emoji for extra added fun :eyes:
     * Please note that this requires the "chat:write.customize" scope
     * @see https://api.slack.com/scopes/chat:write.customize
     */
    const iconEmoji = ':robot_face:';

    /**
     * Our message can be sent to a specific Slack channel via a POST request to the Slack web API.
     * An access token must be provided through the header.
     * The slack channel ID must be specified in the body alongside the message.
     * The icon_emoji is optional.
     * @see https://api.slack.com/methods/chat.postMessage
     */
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${process.env.SLACK_BOT_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        channel: process.env.SLACK_CHANNEL_ID,
        icon_emoji: iconEmoji,
        blocks
      })
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(`Message failed to send: ${data.error}`);
    }

    /**
     * At this stage the message has been successfully posted to the specified Slack channel.
     * If we want to update or reply to the message we need to save the timestamp (ts) from the response.
     * Here we also save the message blocks and icon emoji as well for DRY consistency later.
     * Using Node we can save this data as a JSON file using the file system (fs) module.
     * We can then retrieve the data in a similar fashion later.
     */
    const dirPath = path.resolve(__dirname, '/temp');
    const filePath = path.resolve(dirPath, 'thread.json');

    await fs.mkdir(dirPath);
    await fs.writeFile(
      filePath,
      JSON.stringify({
        ts: data.ts,
        blocks: data.message.blocks,
        iconEmoji
      })
    );

  } catch (error) {
    console.error(error);
  }
})();

/**
 * Escapes Slack special characters.
 * @see https://api.slack.com/reference/surfaces/formatting#escaping
 */
function escapeSpecialCharacters(string) {
  return string.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;');
}
