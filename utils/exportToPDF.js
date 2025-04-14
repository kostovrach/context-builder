
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { marked } = require('marked');

async function exportToPDF(markdownPath, outputPDFPath) {
  const markdown = fs.readFileSync(markdownPath, 'utf-8');
  const htmlContent = marked.parse(markdown);

  const styledHTML = `
    <html>
    <head>
      <meta charset="utf-8">
      <title>Project Context</title>
      <style>
        body { font-family: sans-serif; padding: 40px; max-width: 800px; margin: auto; color: #222; }
        pre { background: #f5f5f5; padding: 10px; overflow-x: auto; }
        code { font-family: Consolas, monospace; }
        h1, h2, h3 { color: #3b82f6; }
      </style>
    </head>
    <body>${htmlContent}</body>
    </html>
  `;

  const tempHTML = path.join(__dirname, 'temp.html');
  fs.writeFileSync(tempHTML, styledHTML, 'utf-8');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`file://${tempHTML}`, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPDFPath, format: 'A4', printBackground: true });
  await browser.close();

  fs.unlinkSync(tempHTML);
  console.log(`PDF успешно создан: ${outputPDFPath}`);
}

module.exports = { exportToPDF };
