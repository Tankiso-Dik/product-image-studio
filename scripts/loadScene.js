#!/usr/bin/env node
// scripts/loadScene.js
const fs = require('fs');
const path = require('path');
const { buildSceneHtml } = require('./buildSceneHtml');

const jsonArg = process.argv[2];
if (!jsonArg) {
  console.error('Usage: node scripts/loadScene.js scenes/<scene>.json');
  process.exit(1);
}

const base = path.basename(jsonArg).replace(/\.json$/, '');
const out = path.join('output', `${base}.temp.html`);
const html = buildSceneHtml({ sceneJsonPath: jsonArg });

fs.mkdirSync('output', { recursive: true });
fs.writeFileSync(out, html, 'utf-8');
console.log(`✅ wrote ${out}`);
