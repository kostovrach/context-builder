
const fs = require('fs');
const path = require('path');
const { scanProject } = require('./utils/scanProject');
const { getFilePreview } = require('./utils/filePreview');
const { scanDependencies } = require('./utils/dependencyScanner');
const { exportToPDF } = require('./utils/exportToPDF');

const OUTPUT_DIR = path.join(__dirname, 'output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'project-context.md');
const OUTPUT_PDF = path.join(OUTPUT_DIR, 'project-context.pdf');
const ROOT_PATH = process.argv[2] || process.cwd();

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  const structure = scanProject(ROOT_PATH);
  const filePreviews = getFilePreview(ROOT_PATH);
  const deps = scanDependencies(ROOT_PATH);

  let depsText = `##Обнаруженные зависимости\n\n`;
  deps.forEach(({ file, deps }) => {
    depsText += `**${file}**\n`;
    deps.forEach(dep => {
      depsText += `  - ${dep}\n`;
    });
    depsText += '\n';
  });

  const result = `##Контекст проекта\n\n` +
    `##Структура\n\n\`\`\`\n${structure}\n\`\`\`\n\n` +
    `##Сниппеты файлов\n\n${filePreviews}\n` +
    `${depsText}`;

  fs.writeFileSync(OUTPUT_FILE, result, 'utf-8');
  console.log(`Контекст проекта сохранён в: ${OUTPUT_FILE}`);

  await exportToPDF(OUTPUT_FILE, OUTPUT_PDF);
})();
