const fs = require('fs');
const path = require('path');
const assert = require('assert');

const { buildSceneHtml } = require('../scripts/buildSceneHtml');

const repoRoot = path.resolve(__dirname, '..');
const sceneJson = path.join(repoRoot, 'scenes/01-thumbnail.json');

const htmlFromJson = buildSceneHtml({ sceneJsonPath: sceneJson });

const controllers = JSON.parse(fs.readFileSync(sceneJson, 'utf-8'));
const htmlFromControllers = buildSceneHtml({
  repoRoot,
  sceneHtmlPath: 'scenes/01-thumbnail.html',
  controllers,
});

assert.strictEqual(htmlFromJson, htmlFromControllers);
assert.ok(/value="example.com"/.test(htmlFromJson));

console.log('buildSceneHtml tests passed');

