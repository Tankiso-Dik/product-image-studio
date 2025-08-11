const path = require('path');
const fs = require('fs');
const express = require('express');
const { buildSceneHtml } = require('./scripts/buildSceneHtml');

const app = express();
const PORT = process.env.PORT || 3000;
const REPO_ROOT = process.cwd();

// Parse JSON bodies for POST endpoints
app.use(express.json({ limit: '12mb' }));
// Static files: serve project assets and scenes
app.use('/assets', express.static(path.join(REPO_ROOT, 'assets')));
app.use('/scenes', express.static(path.join(REPO_ROOT, 'scenes')));
app.use('/tools', express.static(path.join(REPO_ROOT, 'tools')));
app.use('/output', express.static(path.join(REPO_ROOT, 'output')));

// Health
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// List available scenes (bases with both .html and .json)
app.get('/api/scenes', (req, res) => {
  try {
    const scenesDir = path.join(REPO_ROOT, 'scenes');
    const files = fs.readdirSync(scenesDir);
    const bases = new Set(files.map(f => f.replace(/\.(html|json)$/i, '')));
    const names = Array.from(bases).filter(b => files.includes(`${b}.html`) && files.includes(`${b}.json`)).sort();
    res.json({ scenes: names });
  } catch (e) {
    res.status(500).json({ error: 'list_scenes_failed', message: e.message });
  }
});

// Compose endpoint: returns filled HTML based on query params
app.get('/api/compose', (req, res) => {
  const scene = req.query.scene || 'scenes/01-thumbnail.html';
  const controllers = {
    addressBar: req.query.url,
    mainHeading: req.query.title,
    subHeading: req.query.subtitle,
    brandIcon: req.query.icon,
    browserScreenshot: req.query.image,
    theme: req.query.background,
    themeColor: req.query.bgcolor,
  };
  for (let i = 1; i <= 4; i++) {
    const bs = req.query[`browserScreenshot${i}`];
    const sl = req.query[`stepLabel${i}`];
    const st = req.query[`stepText${i}`];
    if (bs) controllers[`browserScreenshot${i}`] = bs;
    if (sl) controllers[`stepLabel${i}`] = sl;
    if (st) controllers[`stepText${i}`] = st;
  }
  const html = buildSceneHtml({ repoRoot: REPO_ROOT, sceneHtmlPath: scene, controllers });
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

app.post('/api/compose', (req, res) => {
  const body = req.body || {};
  // Support new scene base usage: body.scene like '01-thumbnail'
  const base = (body.scene || '').replace(/\.(html|json)$/i, '') || '01-thumbnail';
  const sceneJson = path.join(REPO_ROOT, 'scenes', `${base}.json`);
  if (fs.existsSync(sceneJson)) {
    const overrides = {
      addressBar: body.addressBar || body.url,
      mainHeading: body.mainHeading || body.title,
      subHeading: body.subHeading || body.subtitle,
      brandIcon: body.brandIcon || body.icon,
      browserScreenshot: body.browserScreenshot || body.image,
      browserScreenshotLeft: body.browserScreenshotLeft || body.imageLeft,
      browserScreenshotRight: body.browserScreenshotRight || body.imageRight,
      theme: body.theme || body.background,
      themeColor: body.themeColor || body.bgcolor,
    };
    for (let i = 1; i <= 4; i++) {
      const bs = body[`browserScreenshot${i}`];
      const sl = body[`stepLabel${i}`];
      const st = body[`stepText${i}`];
      if (bs) overrides[`browserScreenshot${i}`] = bs;
      if (sl) overrides[`stepLabel${i}`] = sl;
      if (st) overrides[`stepText${i}`] = st;
    }
    Object.keys(overrides).forEach((k) => overrides[k] == null && delete overrides[k]);
    let html = buildSceneHtml({ sceneJsonPath: sceneJson, overrides });
    for (let i = 1; i <= 4; i++) {
      const label = body[`stepLabel${i}`];
      if (label) {
        const re = new RegExp(`(<[^>]*data-key=\"stepLabel${i}\"[^>]*>)([\\s\\S]*?)(<\/[^>]+>)`);
        html = html.replace(re, (_, a, _b, c) => `${a}${label}${c}`);
      }
      const text = body[`stepText${i}`];
      if (text) {
        const re = new RegExp(`(<[^>]*data-key=\"stepText${i}\"[^>]*>)([\\s\\S]*?)(<\/[^>]+>)`);
        html = html.replace(re, (_, a, _b, c) => `${a}${text}${c}`);
      }
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  }
  // Fallback legacy path usage
  const scene = body.scene || 'scenes/01-thumbnail.html';
  const controllers = {
    addressBar: body.url,
    mainHeading: body.title,
    subHeading: body.subtitle,
    brandIcon: body.icon,
    browserScreenshot: body.image,
    theme: body.background,
    themeColor: body.bgcolor,
  };
  for (let i = 1; i <= 4; i++) {
    const bs = body[`browserScreenshot${i}`];
    const sl = body[`stepLabel${i}`];
    const st = body[`stepText${i}`];
    if (bs) controllers[`browserScreenshot${i}`] = bs;
    if (sl) controllers[`stepLabel${i}`] = sl;
    if (st) controllers[`stepText${i}`] = st;
  }
  const html = buildSceneHtml({ repoRoot: REPO_ROOT, sceneHtmlPath: scene, controllers });
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});


// Default route: index with links to per-scene builders
app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Product Image Studio</title><link rel="stylesheet" href="/assets/css/builder.css"></head><body class="builder-page"><main class="builder-container"><h1 class="builder-title">Product Image Studio</h1><ul class="builder-note" style="list-style:none; padding:0; display:grid; gap:8px;"><li><a href="/tools/scene-01-builder.html">Scene 01 Builder (Single Screenshot)</a></li><li><a href="/tools/scene-02-builder.html">Scene 02 Builder (Feature Spotlight – Two Screenshots)</a></li><li><a href="/tools/scene-02-feature-variation-1-builder.html">Scene 02 Variation 1 Builder (How To Use – One Step)</a></li></ul></main></body></html>`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
