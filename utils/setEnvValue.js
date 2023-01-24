import fs from 'fs/promises';
import os from 'os';

/**
 * Loads .env file and updates an existing key with a new value.
 * @param {string} key - The key name to alter.
 * @param {string} value - The new value to associate with the specified key.
 */
export default async function setEnvValue(key, value) {
  // Parse .env file into an array of key value pairs 
  const envFile = await fs.readFile('./.env', 'utf8');
  const envVariables = envFile.split(os.EOL);

  // Find key and replace value
  // Regex: (?<!#\s*) negatative lookbehind to avoid commented out lines; (?==) positive lookahead to ensure key is followed by equals
  const regex = new RegExp(`(?<!#\s*)${key}(?==)`); // eslint-disable-line no-useless-escape
  const targetIndex = envVariables.indexOf(envVariables.find(line => {
    return line.match(regex);
  }));

  if (targetIndex !== -1) {
    // Replace if value exists already
    envVariables.splice(targetIndex, 1, `${key}=${value}`);
  } else {
    // Add if no value exists
    envVariables.push(`${key}=${value}`);
  }

  // Write updates to .env file
  await fs.writeFile('./.env', envVariables.join(os.EOL));

  return true;
}