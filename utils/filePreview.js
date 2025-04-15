const fs = require('fs');
const path = require('path');

const SUPPORTED_EXTENSIONS = [
  '.js', '.ts', '.json', '.jsx', '.tsx',
  '.html', '.css', '.scss'
];

const IGNORED_DIRS = ['node_modules', '.git', 'dist', 'build'];
const IGNORED_FILES = ['package-lock.json', '.DS_Store', 'thumbs.db'];

function getFilePreview(baseDir, maxLines = 250) {
  let result = '';

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.includes(entry.name)) {
          walk(fullPath);
        }
      } else if (entry.isFile()) {
        if (IGNORED_FILES.includes(entry.name)) continue;

        const ext = path.extname(entry.name).toLowerCase();
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8')
              .split('\n')
              .slice(0, maxLines)
              .join('\n');
            const relativePath = path.relative(baseDir, fullPath);
            result += `### ${relativePath}\n\`\`\`${getMarkdownLang(ext)}\n${content}\n\`\`\`\n\n`;
          } catch (err) {
            console.warn(`Не удалось прочитать: ${fullPath}`);
          }
        }
      }
    }
  }

  walk(baseDir);
  return result;
}

function getMarkdownLang(ext) {
  switch (ext) {
    case '.js': return 'javascript';
    case '.ts': return 'typescript';
    case '.json': return 'json';
    case '.jsx': return 'jsx';
    case '.tsx': return 'tsx';
    case '.html': return 'html';
    case '.css': return 'css';
    case '.scss': return 'scss';
    default: return '';
  }
}

module.exports = { getFilePreview };
