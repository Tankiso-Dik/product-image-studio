const path = require('path');
const fs = require('fs');
const express = require('express');
const puppeteer = require('puppeteer');

// Keep both exports available from buildSceneHtml; htmlEscape may be used by callers later.
// eslint-disable-next-line no-unused-vars
const { buildSceneHtml, htmlEscape } = require('./scripts/buildSceneHtml');
const { buildControllers } = require('./scripts/buildControllers');

const app = express();
const PORT = process.env.PORT || 3000;
const REPO_ROOT = process.cwd();

/* ---------- helpers ---------- */

function safeSceneBase(name) {
  const base = (name || '').replace(/\.(html|json)$/i, '');
  if (!base || base.includes('..') || /[\/]/.test(base)) return null;
  return base;
}

/**
 * Compose full HTML from POST body.
 * - Defaults to base '01-thumbnail' if scene not provided.
 * - Validates scene JSON existence.
 * - Merges controller values + alias overrides.
 * - Applies optional inline CSS vars (bgStart/bgEnd/noiseOpacity).
 */
function composeHtmlFromBody(body = {}) {
  const baseInput = body.scene;
  const base = baseInput ? safeSceneBase(baseInput) : '01-thumbnail';
  if (!base) {
    const err = new Error('invalid_scene');
    err.code = 'INVALID_SCENE';
    throw err;
  }

  const sceneJson = path.join(REPO_ROOT, 'scenes', `${base}.json`);
  if (!fs.existsSync(sceneJson)) {
    const err = new Error('scene_not_found');
    err.code = 'SCENE_NOT_FOUND';
    throw err;
  }

  const controllers = buildControllers(body);

  // Non-destructive alias map for common fields
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
  for (let i = 1; i <= 4; i++) {
    const bs = body[`browserScreenshot${i}`];
    const sl = body[`stepLabel${i}`];
    const st = body[`stepText${i}`];
    if (bs) alias[`browserScreenshot${i}`] = bs;
    if (sl) alias[`stepLabel${i}`] = sl;
    if (st) alias[`stepText${i}`] = st;
  }
  Object.keys(alias).forEach((k) => alias[k] == null && delete alias[k]);

  const overrides = { ...controllers, ...alias };
  let html = buildSceneHtml({ sceneJsonPath: sceneJson, overrides });

  // Optional inline theme vars
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

  return html;
}

/* ---------- middleware & static ---------- */

app.use(express.json({ limit: '12mb' }));
app.use('/assets', express.static(path.join(REPO_ROOT, 'assets')));
app.use('/scenes', express.static(path.join(REPO_ROOT, 'scenes')));
app.use('/tools', express.static(path.join(REPO_ROOT, 'tools')));
app.use('/output', express.static(path.join(REPO_ROOT, 'output')));

/* ---------- health ---------- */

app.get('/healthz', (_req, res) => res.json({ ok: true }));

/* ---------- list scenes ---------- */

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

/* ---------- compose (GET) ---------- */
/**
 * GET uses an HTML scene path within /scenes (e.g. 01-thumbnail.html or scenes/01-thumbnail.html).
 * - Ensures path stays under /scenes
 * - Ensures file exists
 * - Applies optional bgStart/bgEnd/noiseOpacity
 */
app.get('/api/compose', (req, res) => {
  try {
    const scenesRoot = path.join(REPO_ROOT, 'scenes');
    const sceneParam = req.query.scene || '01-thumbnail.html';
    const scenePath = path.join(scenesRoot, sceneParam);

    if (!scenePath.startsWith(scenesRoot + path.sep)) {
      return res.status(400).json({ error: 'invalid_scene', message: 'Scene path escapes scenes/' });
    }
    if (!fs.existsSync(scenePath)) {
      return res.status(404).json({ error: 'scene_not_found' });
    }

    const controllers = buildControllers(req.query);
    let html = buildSceneHtml({ sceneHtmlPath: scenePath, controllers });

    const { bgStart, bgEnd, noiseOpacity } = req.query;
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
  } catch (e) {
    console.error('GET /api/compose failed:', e);
    res.status(500).json({ error: 'compose_failed', message: e.message });
  }
});

/* ---------- compose (POST) ---------- */
/**
 * POST path uses JSON scene base with defaults + safe validation in composeHtmlFromBody.
 */
app.post('/api/compose', (req, res) => {
  try {
    const html = composeHtmlFromBody(req.body || {});
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (e) {
    if (e.code === 'INVALID_SCENE') {
      return res.status(400).json({ error: 'invalid_scene' });
    }
    if (e.code === 'SCENE_NOT_FOUND') {
      return res.status(404).json({ error: 'scene_not_found' });
    }
    console.error('POST /api/compose failed:', e);
    res.status(500).json({ error: 'compose_failed', message: e.message });
  }
});

/* ---------- screenshot (POST) ---------- */
/**
 * Renders a screenshot (PNG) from the composed HTML.
 * Accepts: { scene, width, height, ...overrides }
 */
app.post('/api/screenshot', async (req, res) => {
  try {
    const width = Number(req.body?.width) || 1600;
    const height = Number(req.body?.height) || 900;

    const html = composeHtmlFromBody(req.body || {});
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const raw = await page.screenshot({ type: 'png' });
    await browser.close();

    const buf = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
    res.setHeader('Content-Type', 'image/png');
    res.send(buf);
  } catch (e) {
    if (e.code === 'INVALID_SCENE') {
      return res.status(400).json({ error: 'invalid_scene' });
    }
    if (e.code === 'SCENE_NOT_FOUND') {
      return res.status(404).json({ error: 'scene_not_found' });
    }
    console.error('POST /api/screenshot failed:', e);
    res.status(500).json({ error: 'screenshot_failed', message: e.message });
  }
});

/* ---------- index ---------- */

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

/* ---------- listen / export ---------- */

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
