/**
 * Converts a unix timestamp into a human readable date string.
 * Formatted like "29/04/2023 12:05:56"
 * @param {string | number} timestamp Current epoch based unix timestamp
 * @returns The date in a human readable string
 */
export default function getHumanReadableDateFromUnixTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  const day = padLeadingZerosInStringToMaxLength(`${date.getDate()}`, 2);
  const month = padLeadingZerosInStringToMaxLength(`${date.getMonth() + 1}`, 2);
  const year = padLeadingZerosInStringToMaxLength(`${date.getFullYear()}`, 4);
  const hours = padLeadingZerosInStringToMaxLength(`${date.getHours()}`, 2);
  const minutes = padLeadingZerosInStringToMaxLength(`${date.getMinutes()}`, 2);
  const seconds = padLeadingZerosInStringToMaxLength(`${date.getSeconds()}`, 2);
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Pads a string with leading zeros if it's shorter than a specified length.
 * Warning: The string will be trimmed if the maxLength is shorter than the string length.
 * @param {string} string - The string to pad
 * @param {number} maxDigits - The maximum length of the string
 * @returns A new trimmed string with padded zeros.
 */
function padLeadingZerosInStringToMaxLength(string, maxLength) {
  return string.padStart(Math.abs(maxLength), '0').slice(-Math.abs(maxLength));
}