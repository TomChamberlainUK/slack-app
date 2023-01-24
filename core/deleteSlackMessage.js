/**
 * @typedef SlackDeleteMessageResponse
 * @property {boolean} isSuccessful - Whether or not the message was successfully deleted.
 */

/**
 * Deletes a message in a channel in Slack via the Slack web API.
 * @param {string} timestamp - The unix-based timestamp of the message.
 * @param {Object} config - Message configuration.
 * @param {string} config.channelId - The ID of the channel where the message has been sent.
 * @param {string} config.accessToken - A valid Slack app bot user OAuth2 token.
 * @returns {SlackDeleteMessageResponse} Success check
 */
export default async function deleteSlackMessage(timestamp, { channelId, accessToken }) {
  const response = await fetch('https://slack.com/api/chat.delete', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json; charset=utf-8',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      channel: channelId,
      ts: timestamp
    })
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Message failed to delete: ${data.error}`);
  }

  return {
    isSuccessful: true
  }
}