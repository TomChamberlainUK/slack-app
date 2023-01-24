import fs from 'fs/promises';
import yaml from 'js-yaml';

/**
 * Asynchronously loads a .yml file and parses it into a standard Javascript object.
 * @param {string} filePath - The path to the .yml file.
 * @returns A promise that resolves into an object.
 */
export default async function loadYmlFile(filePath) {
  const file = await fs.readFile(filePath, 'utf8');
  const object = yaml.load(file);
  return object;
}