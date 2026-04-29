const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = ['manifest.json', 'pages.json', 'package.json'];

for (const file of files) {
  const fullPath = path.join(root, file);
  JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  console.log(`ok ${file}`);
}
