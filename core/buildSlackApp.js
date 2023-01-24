/**
 * @typedef {Object} SlackAppBuildStatus
 * @property {boolean} isSuccessful - Whether or not the build succeeded
 * @property {string} appId - The ID of the built app
 */

/**
 * Builds a Slack app via the Slack web API.
 * @param {object} manifest - A build manifest that specificies configuration and scope of app.
 * @param {string} accessToken - A valid Slack config OAuth2 access token to authorise the build.
 * @returns {SlackAppBuildStatus} The app ID and build status.
 */
export default async function buildSlackApp(manifest, accessToken) {
  const response = await fetch('https://slack.com/api/apps.manifest.create', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json; charset=utf-8',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      manifest
    })
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Slack app creation failed: ${data.error}`);
  }

  return {
    isSuccessful: true,
    appId: data.app_id
  };
}