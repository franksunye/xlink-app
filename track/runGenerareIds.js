// runGenerateIds.js
import generateIds from './generateEventId.js';

async function run() {
  const id = await generateIds();
  console.log(`生成的ID: ${id}`);
}

run();
