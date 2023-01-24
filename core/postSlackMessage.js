/**
 * @typedef SlackPostMessageResponse
 * @property {boolean} isSuccessful - Whether or not the message was successfully sent.
 * @property {string} timestamp - A unix timestamp representing the exact time the message was sent.
 */

/**
 * Sends a message to a channel in Slack via the Slack web API.
 * @param {string} message - The message to be sent.
 * @param {Object} config - Message configuration.
 * @param {string} config.channelId - The ID of the channel to which the message will be sent.
 * @param {string} config.accessToken - A valid Slack app bot user OAuth2 token.
 * @returns {SlackPostMessageResponse} Success check and timestamp.
 */
export default async function postSlackMessage(message, { channelId, accessToken }) {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json; charset=utf-8',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      channel: channelId,
      text: message
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