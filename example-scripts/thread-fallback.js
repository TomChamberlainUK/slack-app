const https = require('https');

/** 
 * An example script for posting a message on Slack via Node 14.
 * In this example we will post a message to a specified channel.
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
     * The content of the message can be formatted as either a string, or as object based "blocks".
     * For this example we'll format our message as a simple string.
     * @see https://api.slack.com/reference/block-kit/blocks
     */
    const message = 'This is a reply to a Slack thread';

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
    const postResponse = await httpsRequest(
      'https://slack.com/api/chat.postMessage',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${process.env.SLACK_BOT_ACCESS_TOKEN}`
        }
      },
      JSON.stringify({
        channel: process.env.SLACK_CHANNEL_ID,
        icon_emoji: iconEmoji,
        text: escapeSpecialCharacters(message)
      })
    );

    const data = JSON.parse(postResponse);

    if (!data.ok) {
      throw new Error(`Message failed to send: ${data.error}`);
    }

  } catch (error) {
    console.error(error);
  }
})();

/**
 * A promise based wrapper for https requests.
 * @param {string | URL} url - The URL to make the request to
 * @param {https.RequestOptions} options - Options to be passed to {@link https.request}
 * @param {any} payload - Data to be passed in the request
 * @see {@link https.request}
 * @returns A promise that resolves on a successful request, and rejects when encountering an error.
 */
function httpsRequest(url, options, payload) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve(body);
      });

      res.on('error', () => {
        reject(body);
      });
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Escapes Slack special characters
 * @see https://api.slack.com/reference/surfaces/formatting#escaping
 */
function escapeSpecialCharacters(string) {
  return string.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;');
}
