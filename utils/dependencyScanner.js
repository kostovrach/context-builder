
const fs = require('fs');
const path = require('path');

const SUPPORTED_DEP_FILES = ['.js', '.ts', '.html', '.css', '.scss'];
const IGNORED_DIRS = ['node_modules', '.git', 'dist', 'build'];

function scanDependencies(baseDir) {
  const dependencies = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !IGNORED_DIRS.includes(entry.name)) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (SUPPORTED_DEP_FILES.includes(ext)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const relativePath = path.relative(baseDir, fullPath);
          const found = extractDeps(content, ext);
          if (found.length > 0) {
            dependencies.push({ file: relativePath, deps: found });
          }
        }
      }
    }
  }

  walk(baseDir);
  return dependencies;
}

function extractDeps(content, ext) {
  const deps = [];

  if (['.js', '.ts'].includes(ext)) {
    const importRegex = /import\s+(?:.*?\s+from\s+)?["']([^"']+)["']/g;
    const requireRegex = /require\(["']([^"']+)["']\)/g;
    content.matchAll(importRegex).forEach(m => deps.push(m[1]));
    content.matchAll(requireRegex).forEach(m => deps.push(m[1]));
  }

  if (ext === '.html') {
    const linkRegex = /<link[^>]+href=["']([^"']+)["']/g;
    const scriptRegex = /<script[^>]+src=["']([^"']+)["']/g;
    content.matchAll(linkRegex).forEach(m => deps.push(m[1]));
    content.matchAll(scriptRegex).forEach(m => deps.push(m[1]));
  }

  if (ext === '.css' || ext === '.scss') {
    const importRegex = /@(import|use)\s+["']([^"']+)["']/g;
    content.matchAll(importRegex).forEach(m => deps.push(m[2]));
  }

  return deps;
}

module.exports = { scanDependencies };
