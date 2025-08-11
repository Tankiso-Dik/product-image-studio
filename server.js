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
  const scene = req.query.scene || 'scenes/01-thumbnail.html';
  const controllers = buildControllers(req.query);
  const html = buildSceneHtml({ repoRoot: REPO_ROOT, sceneHtmlPath: scene, controllers });
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// Compose endpoint (POST): supports scene base + overrides from body
app.post('/api/compose', (req, res) => {
  const body = req.body || {};
  // Support new scene base usage: body.scene like '01-thumbnail'
  const base = (body.scene || '').replace(/\.(html|json)$/i, '') || '01-thumbnail';
  const sceneJson = path.join(REPO_ROOT, 'scenes', `${base}.json`);
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

    const html = buildSceneHtml({ sceneJsonPath: sceneJson, overrides });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  }

  // Fallback legacy path usage
  const scene = body.scene || 'scenes/01-thumbnail.html';
  const html = buildSceneHtml({ repoRoot: REPO_ROOT, sceneHtmlPath: scene, controllers });
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
      <li><a href="/tools/scene-02-builder.html">Scene 02 Builder (Feature Spotlight – Two Screenshots)</a></li>
      <li><a href="/tools/scene-02-feature-variation-1-builder.html">Scene 02 Variation 1 Builder (How To Use – One Step)</a></li>
    </ul>
  </main>
</body>
</html>`
    );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
