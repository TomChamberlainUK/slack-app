/**
 * @typedef SlackPostFormattedMessageResponse
 * @property {boolean} isSuccessful - Whether or not the message was successfully sent.
 * @property {string} timestamp - A unix timestamp representing the exact time the message was sent.
 */

/**
 * Sends a message to a channel in Slack via the Slack web API.
 * @param {string} blocks - The message to be sent formatted in Slack blocks.
 * @param {Object} config - Message configuration.
 * @param {string} config.channelId - The ID of the channel to which the message will be sent.
 * @param {string} config.accessToken - A valid Slack app bot user OAuth2 token.
 * @see https://api.slack.com/reference/block-kit/blocks
 * @see https://api.slack.com/reference/surfaces/formatting#basics
 * @returns {SlackPostFormattedMessageResponse} Success check and timestamp.
 */
export default async function postFormattedSlackMessage(blocks, { channelId, accessToken }) {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json; charset=utf-8',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      channel: channelId,
      blocks
    })
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Message failed to send: ${data.error}`);
  }

  return {
    isSuccessful: true,
    timestamp: data.ts
  };
}