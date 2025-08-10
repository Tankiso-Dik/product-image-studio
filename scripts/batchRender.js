// scripts/batchRender.js (CommonJS)
const { execFile } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const pExec = promisify(execFile);

const W = Number(process.argv[2] || 1600);
const H = Number(process.argv[3] || 900);

fs.mkdirSync('output', { recursive: true });
const scenes = fs.readdirSync('scenes').filter((f) => f.endsWith('.json'));

(async () => {
  for (const json of scenes) {
    const base = json.replace(/\.json$/, '');
    console.log(`➡️  ${base}`);
    await pExec('node', ['scripts/loadScene.js', path.join('scenes', json)], { stdio: 'inherit' });
    const temp = path.join('output', `${base}.temp.html`);
    const png = path.join('output', `${base}.png`);
    await pExec('node', ['scripts/render.js', temp, png, String(W), String(H)], { stdio: 'inherit' });
  }
  console.log('🎉 Batch done.');
})();
