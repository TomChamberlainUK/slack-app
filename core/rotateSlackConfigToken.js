/** 
 * @typedef {Object} ReturnedTokens
 * @property {boolean} isSuccessful - Whether or not the token was successfully rotated.
 * @property {string} refreshToken - A new refresh token for a developer account on Slack
 * @property {string} accessToken - A new access token for a developer account on Slack
 */

/**
 * Rotates Slack config tokens.
 * This ensures we have an up to date access token to authorize config changes.
 * @param {string} refreshToken - A valid refresh token for a developer account on Slack
 * @returns {ReturnedTokens} New access and refresh tokens
 */
export default async function rotateSlackConfigToken(refreshToken) {

  const query = new URLSearchParams({ refresh_token: refreshToken });
  const response = await fetch(`https://slack.com/api/tooling.tokens.rotate?${query}`);
  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Failed to refresh config access token: ${data.error}`);
  }

  return {
    isSuccessful: true,
    refreshToken: data.refresh_token,
    accessToken: data.token
  }
}