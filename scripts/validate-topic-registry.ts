import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

import {validateTopicRegistry} from '../lib/foundation/topic-registry.ts';

const registryPath = resolve(process.cwd(), 'config/foundation/topic-registry.v1.json');

async function main(): Promise<void> {
  let input: unknown;
  try {
    input = JSON.parse(await readFile(registryPath, 'utf8')) as unknown;
  } catch (error) {
    input = {topics: [], repositoryWarning: error instanceof Error ? error.message : String(error)};
  }

  const result = validateTopicRegistry(input);
  console.log(`Topic Registry Validation: ${result.topics.length} valid topic(s), ${result.warnings.length} warning(s)`);
  for (const item of result.warnings) console.warn(`[${item.code}] ${item.message}`);
}

await main();
