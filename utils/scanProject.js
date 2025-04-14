
const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = ['node_modules', '.git', 'dist', 'build'];

function scanProject(dir, prefix = '') {
  let output = '';
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORED_DIRS.includes(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      output += `${prefix} ${entry.name}/\n`;
      output += scanProject(fullPath, prefix + '  ');
    } else {
      output += `${prefix} ${entry.name}\n`;
    }
  }
  return output;
}

module.exports = { scanProject };
