/**
 * Escapes Slack special characters
 * @see https://api.slack.com/reference/surfaces/formatting#escaping
 */
export default function escapeSpecialCharacters(string) {
 return string.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
}