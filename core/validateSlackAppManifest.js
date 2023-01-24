/**
 * Validates a manifest via a POST request to the Slack web API.
 * @param {object} manifest - The manifest to be validated.
 * @param {string} accessToken - A valid Slack configuration access token.
 * @returns {boolean} Whether or not the manifest validated.
 * @see https://api.slack.com/methods/apps.manifest.validate
 */
export default async function validateSlackAppManifest(manifest, accessToken) {
  const response = await fetch('https://slack.com/api/apps.manifest.validate', {
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
    // Log out specific component errors, where applicable.
    // if (data.errors) {
    //   data.errors.forEach(({ pointer, message, related_component }) => {
    //     let errorString = `Error at ${pointer}: ${message}.`;
    //     if (related_component) errorString += ` (related component: ${related_component})`
    //     console.error(errorString);
    //   });
    // }
    throw new Error(`Manifest validation failed: ${data.error}`);
  }

  return true;
}