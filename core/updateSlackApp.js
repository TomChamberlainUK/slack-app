/**
 * @typedef {Object} SlackAppBuildStatus
 * @property {boolean} isSuccessful - Whether or not the update succeeded
 */

/**
 * Builds a Slack app via the Slack web API.
 * @param {string} appId - The ID of the app to update.
 * @param {object} manifest - A build manifest that specificies configuration and scope of app.
 * @param {string} accessToken - A valid Slack config OAuth2 access token to authorise the build.
 * @returns {SlackAppBuildStatus} The build status.
 */
export default async function updateSlackApp(appId, manifest, accessToken) {
  const response = await fetch('https://slack.com/api/apps.manifest.update', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json; charset=utf-8',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      app_id: appId,
      manifest
    })
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Slack app update failed: ${data.error}`);
  }

  return {
    isSuccessful: true
  }
}