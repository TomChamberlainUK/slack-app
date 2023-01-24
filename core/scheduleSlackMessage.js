/**
 * @typedef SlackScheduleMessageResponse
 * @property {boolean} isSuccessful - Whether or not the message was successfully scheduled.
 */

/**
 * Schedules a message to a channel in Slack via the Slack web API.
 * @param {string} message - The message to be sent.
 * @param {Object} config - Message configuration.
 * @param {string} config.channelId - The ID of the channel to which the message will be sent.
 * @param {string} config.timestamp - A unix-based timestamp representing when to deliver the message.
 * @param {string} config.accessToken - A valid Slack app bot user OAuth2 token.
 * @returns {SlackScheduleMessageResponse} Success check and timestamp.
 */
export default async function scheduleSlackMessage(message, { channelId, timestamp, accessToken }) {
  const response = await fetch('https://slack.com/api/chat.scheduleMessage', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json; charset=utf-8',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      channel: channelId,
      post_at: timestamp,
      text: message,
    })
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Message failed to schedule: ${data.error}`);
  }

  return {
    isSuccessful: true
  }
}