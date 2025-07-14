// scripts/generateAllComponents.js
const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../public/components');
const outputFile = path.join(__dirname, '../public/allComponents.js');

const files = fs.readdirSync(componentsDir).filter(file => file.endsWith('.js'));

const imports = files
  .map(file => `import './components/${file}';`)
  .join('\n');

fs.writeFileSync(outputFile, imports);
console.log('✅ allComponents.js generated with:', files.length, 'components');
