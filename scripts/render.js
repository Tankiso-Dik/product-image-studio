// scripts/render.js (CommonJS)
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const htmlArg = process.argv[2];
const outArg = process.argv[3] || 'output/out.png';
const width = Number(process.argv[4] || 1600);
const height = Number(process.argv[5] || 900);

if (!htmlArg || !fs.existsSync(htmlArg)) {
  console.error('Usage: node scripts/render.js output/<scene>.temp.html [out.png] [width] [height]');
  process.exit(1);
}

(async () => {
  const absHtml = path.resolve(htmlArg);
  const absOut = path.resolve(outArg);

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.goto(`file://${absHtml}`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: absOut });
  await browser.close();
  console.log(`✅ PNG: ${absOut} (${width}x${height})`);
})();
