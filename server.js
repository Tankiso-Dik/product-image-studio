const path = require('path');
const fs = require('fs');
const express = require('express');

// Keep both exports available from buildSceneHtml; htmlEscape may be used by callers later.
// eslint-disable-next-line no-unused-vars
const { buildSceneHtml, htmlEscape } = require('./scripts/buildSceneHtml');
const { buildControllers } = require('./scripts/buildControllers');

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
app.get('/api/scenes', (_req, res) => {
  try {
    const scenesDir = path.join(REPO_ROOT, 'scenes');
    const files = fs.readdirSync(scenesDir);
    const bases = new Set(files.map(f => f.replace(/\.(html|json)$/i, '')));
    const names = Array.from(bases)
      .filter(b => files.includes(`${b}.html`) && files.includes(`${b}.json`))
      .sort();
    res.json({ scenes: names });
  } catch (e) {
    res.status(500).json({ error: 'list_scenes_failed', message: e.message });
  }
});

// Compose endpoint (GET): returns filled HTML based on query params
app.get('/api/compose', (req, res) => {
  const scenesRoot = path.join(REPO_ROOT, 'scenes');
  const sceneParam = req.query.scene || '01-thumbnail.html';
  const scenePath = path.join(scenesRoot, sceneParam);
  if (!scenePath.startsWith(scenesRoot + path.sep)) {
    return res.status(400).json({ error: 'invalid_scene', message: 'Scene path escapes scenes/' });
  }
  const controllers = buildControllers(req.query);
  let html = buildSceneHtml({ sceneHtmlPath: scenePath, controllers });

  // Optional background overrides via query
  const bgStart = req.query.bgStart;
  const bgEnd = req.query.bgEnd;
  const noiseOpacity = req.query.noiseOpacity;
  if (bgStart || bgEnd || noiseOpacity) {
    const styleParts = [];
    if (bgStart) styleParts.push(`--bg-start:${htmlEscape(bgStart)}`);
    if (bgEnd) styleParts.push(`--bg-end:${htmlEscape(bgEnd)}`);
    if (noiseOpacity) styleParts.push(`--noise-opacity:${htmlEscape(noiseOpacity)}`);
    if (styleParts.length) {
      const inline = styleParts.join(';');
      html = html.replace('<body', `<body style="${inline}"`);
    }
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// Compose endpoint (POST): supports scene base + overrides from body
app.post('/api/compose', (req, res) => {
  const body = req.body || {};
  const scenesRoot = path.join(REPO_ROOT, 'scenes');
  // Support new scene base usage: body.scene like '01-thumbnail'
  const base = (body.scene || '').replace(/\.(html|json)$/i, '') || '01-thumbnail';
  const sceneJson = path.join(scenesRoot, `${base}.json`);
  if (!sceneJson.startsWith(scenesRoot + path.sep)) {
    return res.status(400).json({ error: 'invalid_scene', message: 'Scene path escapes scenes/' });
  }
  const controllers = buildControllers(body);

  if (fs.existsSync(sceneJson)) {
    // Map common aliases from body → scene keys (non-destructive)
    const alias = {
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

    // Pass through numbered step fields if present
    for (let i = 1; i <= 4; i++) {
      const bs = body[`browserScreenshot${i}`];
      const sl = body[`stepLabel${i}`];
      const st = body[`stepText${i}`];
      if (bs) alias[`browserScreenshot${i}`] = bs;
      if (sl) alias[`stepLabel${i}`] = sl;
      if (st) alias[`stepText${i}`] = st;
    }

    // Drop null/undefined so we don’t overwrite JSON defaults
    Object.keys(alias).forEach((k) => alias[k] == null && delete alias[k]);

    // Combine controller-derived values with our alias map (alias wins)
    const overrides = { ...controllers, ...alias };

    let html = buildSceneHtml({ sceneJsonPath: sceneJson, overrides });
    // Optional background overrides via POST
    const { bgStart, bgEnd, noiseOpacity } = body;
    if (bgStart || bgEnd || noiseOpacity) {
      const styleParts = [];
      if (bgStart) styleParts.push(`--bg-start:${htmlEscape(bgStart)}`);
      if (bgEnd) styleParts.push(`--bg-end:${htmlEscape(bgEnd)}`);
      if (noiseOpacity) styleParts.push(`--noise-opacity:${htmlEscape(noiseOpacity)}`);
      if (styleParts.length) {
        const inline = styleParts.join(';');
        html = html.replace('<body', `<body style="${inline}"`);
      }
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  }

  // Fallback legacy path usage
  const sceneParam = body.scene || '01-thumbnail.html';
  const scenePath = path.join(scenesRoot, sceneParam);
  if (!scenePath.startsWith(scenesRoot + path.sep)) {
    return res.status(400).json({ error: 'invalid_scene', message: 'Scene path escapes scenes/' });
  }
  let html = buildSceneHtml({ sceneHtmlPath: scenePath, controllers });
  const { bgStart, bgEnd, noiseOpacity } = body;
  if (bgStart || bgEnd || noiseOpacity) {
    const styleParts = [];
    if (bgStart) styleParts.push(`--bg-start:${htmlEscape(bgStart)}`);
    if (bgEnd) styleParts.push(`--bg-end:${htmlEscape(bgEnd)}`);
    if (noiseOpacity) styleParts.push(`--noise-opacity:${htmlEscape(noiseOpacity)}`);
    if (styleParts.length) {
      const inline = styleParts.join(';');
      html = html.replace('<body', `<body style="${inline}"`);
    }
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// Default route: index with links to per-scene builders
app.get('/', (_req, res) => {
  res
    .type('html')
    .send(
      `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Product Image Studio</title>
  <link rel="stylesheet" href="/assets/css/builder.css">
</head>
<body class="builder-page">
  <main class="builder-container">
    <h1 class="builder-title">Product Image Studio</h1>
    <ul class="builder-note builder-links">
      <li><a href="/tools/scene-01-builder.html">Scene 01 Builder (Single Screenshot)</a></li>
      <li><a href="/tools/scene-02-builder.html">Scene 02 Builder (Feature Spotlight)</a></li>
      <li><a href="/tools/scene-03-split-builder.html">Scene 03 Builder (Split Layout)</a></li>
    </ul>
  </main>
</body>
</html>`
    );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
