const fs = require('fs');
const path = require('path');
const assert = require('assert');

const { buildSceneHtml, htmlEscape } = require('../scripts/buildSceneHtml');

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

// XSS escaping tests for dynamic attributes
const malicious = 'http://evil.com/img.png" onerror="alert(1)';
const escaped = htmlEscape(malicious);
const xssHtml = buildSceneHtml({
  repoRoot,
  sceneHtmlPath: 'test/fixtures/xss-fixture.html',
  controllers: {
    brandIcon: malicious,
    browserScreenshot: malicious,
    browserScreenshotLeft: malicious,
    browserScreenshotRight: malicious,
    browserScreenshot1: malicious,
  },
});

['brandIcon', 'browserScreenshot', 'browserScreenshotLeft', 'browserScreenshotRight', 'browserScreenshot1'].forEach(
  (key) => {
    assert.ok(xssHtml.includes(`data-key="${key}"`), `${key} marker missing`);
  }
);
const srcCount = xssHtml.split(`src="${escaped}"`).length - 1;
assert.strictEqual(srcCount, 5);
assert.ok(!/onerror="alert\(1\)"/.test(xssHtml));

console.log('buildSceneHtml tests passed');

