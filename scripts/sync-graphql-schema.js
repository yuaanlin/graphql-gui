const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function main() {

  const devApiSchemaUrl = 'https://api.myboom.tw/schema';

  const d = await axios.get(devApiSchemaUrl);

  const s = `import { gql } from '@apollo/client';

/**
 *  This file is auto sync from server, please don't change it manually.
 *  Using "yarn sync-schema" to auto sync.
 */
const typeDefs = gql\`
${
  d.data
    .replace(/\n {2}/g, '\n    ')
    .replace(/\n/g, '\n    ')
    .replace(/\n {4}\n/g, '\n\n')
}
\`

export default typeDefs;

`;

  const p = path.resolve(require.main.filename, '../../src/api/typeDefs.ts');

  console.info(`Schema downloaded from ${
    devApiSchemaUrl} has been saved to ${p}`);

  fs.writeFileSync(p, s);
}

main();
