const fs = require('fs');
const path = require('path');

function htmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderSection(sec) {
  const tasks = (sec.tasks || [])
    .map(
      (t) =>
        `\n    <div class="task-item">\n      <div class="task-checkbox ${t.completed ? 'completed' : ''}"></div>\n      <div class="task-text">${htmlEscape(t.text || '')}</div>\n    </div>`
    )
    .join('');

  const rawProgress = Number.isFinite(sec.progress) ? Math.max(0, Math.min(100, sec.progress)) : null;
  const progress = rawProgress !== null
    ? `<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"${rawProgress}\" aria-valuemin=\"0\" aria-valuemax=\"100\">\n         <div class=\"progress-fill\" style=\"--progress:${rawProgress}%\"></div>\n       </div>`
    : '';

  return `\n  <div class="dashboard-section">\n    <div class="section-header">\n      <span class="section-emoji">${htmlEscape(sec.emoji || '')}</span>\n      <span class="section-title">${htmlEscape(sec.title || '')}</span>\n    </div>\n    <div class="task-list">\n      ${tasks}\n    </div>\n    ${progress}\n  </div>`;
}

function replaceAddressBar(html, data) {
  if (!Object.prototype.hasOwnProperty.call(data, 'addressBar')) return html;
  return html.replace(
    /(<input[^>]*data-key="addressBar"[^>]*value=")[^"]*(")/,
    (_, a, b) => `${a}${htmlEscape(data.addressBar || '')}${b}`
  );
}

function replaceHeadings(html, data) {
  let out = html;
  if (Object.prototype.hasOwnProperty.call(data, 'mainHeading')) {
    out = out.replace(
      /(<h1[^>]*data-key="mainHeading"[^>]*>)([\s\S]*?)(<\/h1>)/,
      (_, a, _b, c) => `${a}${htmlEscape(data.mainHeading || '')}${c}`
    );
  }
  if (Object.prototype.hasOwnProperty.call(data, 'subHeading')) {
    out = out.replace(
      /(<p[^>]*data-key="subHeading"[^>]*>)([\s\S]*?)(<\/p>)/,
      (_, a, _b, c) => `${a}${htmlEscape(data.subHeading || '')}${c}`
    );
  }
  return out;
}

function replaceBrandIcon(html, data) {
  if (!Object.prototype.hasOwnProperty.call(data, 'brandIcon')) return html;
  return html.replace(
    /(<img[^>]*data-key="brandIcon"[^>]*src=")[^"]*(")/,
    (_, a, b) => `${a}${data.brandIcon}${b}`
  );
}

function replaceScreenshots(html, data, overrides = {}) {
  let out = html;

  const imgSrc = data.browserScreenshot || '../assets/screenshots/placeholder.png';
  out = out.replace(
    /(<img[^>]*class="[^"]*\bbrowser-screenshot\b[^"]*"(?![^>]*\bleft\b)(?![^>]*\bright\b)[^>]*src=")[^"]*(")/,
    (_, a, b) => `${a}${imgSrc}${b}`
  );

  if (data.browserScreenshotLeft) {
    out = out.replace(
      /(<img[^>]*data-key="browserScreenshotLeft"[^>]*src=")[^"]*(")/,
      (_, a, b) => `${a}${data.browserScreenshotLeft}${b}`
    );
    if (!/data-has-screenshot-left=/.test(out) && !/placeholder\.png/.test(String(data.browserScreenshotLeft))) {
      out = out.replace('<body', '<body data-has-screenshot-left="true"');
    }
  }

  if (data.browserScreenshotRight) {
    out = out.replace(
      /(<img[^>]*data-key="browserScreenshotRight"[^>]*src=")[^"]*(")/,
      (_, a, b) => `${a}${data.browserScreenshotRight}${b}`
    );
    if (!/data-has-screenshot-right=/.test(out) && !/placeholder\.png/.test(String(data.browserScreenshotRight))) {
      out = out.replace('<body', '<body data-has-screenshot-right="true"');
    }
  }

  for (let i = 1; i <= 4; i++) {
    const key = `browserScreenshot${i}`;
    if (data[key]) {
      const re = new RegExp(`(<img[^>]*data-key=\"${key}\"[^>]*src=\")[^\"]*(\")`);
      out = out.replace(re, (_, a, b) => `${a}${data[key]}${b}`);
      const flag = `data-has-screenshot-${i}`;
      if (!new RegExp(flag).test(out) && !/placeholder\.png/.test(String(data[key]))) {
        out = out.replace('<body', `<body ${flag}="true"`);
      }
    }
    const labelKey = `stepLabel${i}`;
    if (data[labelKey]) {
      const labelRe = new RegExp(`(<[^>]*data-key=\"${labelKey}\"[^>]*>)([\s\S]*?)(<\/[^>]+>)`);
      out = out.replace(labelRe, (_, a, _b, c) => `${a}${htmlEscape(data[labelKey])}${c}`);
    }
    const textKey = `stepText${i}`;
    if (Object.prototype.hasOwnProperty.call(data, textKey)) {
      const textRe = new RegExp(`(<[^>]*data-key=\"${textKey}\"[^>]*>)([\s\S]*?)(<\/[^>]+>)`);
      out = out.replace(textRe, (_, a, _b, c) => `${a}${htmlEscape(data[textKey] || '')}${c}`);
    }
  }

  for (let i = 1; i <= 4; i++) {
    const key = `stepText${i}`;
    if (Object.prototype.hasOwnProperty.call(overrides, key)) {
      const textRe = new RegExp(`(<[^>]*data-key=\"${key}\"[^>]*>)([\s\S]*?)(<\/[^>]+>)`);
      out = out.replace(textRe, (_, a, _b, c) => `${a}${htmlEscape(overrides[key] || '')}${c}`);
    }
  }

  if (!/data-has-screenshot=/.test(out)) {
    const isPlaceholder = /placeholder\.png(?:$|\?|#)/.test(String(imgSrc));
    if (!isPlaceholder && !data.browserScreenshotLeft && !data.browserScreenshotRight) {
      out = out.replace('<body', '<body data-has-screenshot="true"');
    }
  }

  return out;
}

function replaceTheme(html, data) {
  if (!Object.prototype.hasOwnProperty.call(data, 'theme')) return html;
  return html.replace('<body', `<body data-theme="${htmlEscape(data.theme)}"`);
}

function replaceSections(html, data) {
  if (!Array.isArray(data.sections)) return html;
  const sectionsHtml = data.sections.map((sec) => renderSection(sec)).join('\n');
  return html.replace(
    /(<div[^>]*data-key="sections"[^>]*>)([\s\S]*?)(<\/div>)/,
    (_, a, _b, c) => `${a}\n${sectionsHtml}\n${c}`
  );
}

function ensureBaseHref(html) {
  if (/<base\s+href=/i.test(html)) return html;
  return html.replace(/<head(\s[^>]*)?>/i, (m) => `${m}<base href="/">`);
}

function applyReplacements(html, data, overrides) {
  let out = html;
  out = replaceAddressBar(out, data);
  out = replaceHeadings(out, data);
  out = replaceBrandIcon(out, data);
  out = replaceScreenshots(out, data, overrides);
  out = replaceTheme(out, data);
  out = replaceSections(out, data);
  out = ensureBaseHref(out);
  return out;
}

function loadInputs({ repoRoot, sceneHtmlPath, controllers, sceneJsonPath }) {
  if (sceneJsonPath) {
    const jsonAbs = path.resolve(sceneJsonPath);
    const base = path.basename(jsonAbs).replace(/\.json$/, '');
    const htmlPath = path.join(path.dirname(jsonAbs), `${base}.html`);
    const data = JSON.parse(fs.readFileSync(jsonAbs, 'utf-8'));
    const html = fs.readFileSync(htmlPath, 'utf-8');
    return { html, data };
    }
  const repo = repoRoot || process.cwd();
  const sceneAbs = path.resolve(repo, sceneHtmlPath);
  const html = fs.readFileSync(sceneAbs, 'utf-8');
  const data = { ...(controllers || {}) };
  return { html, data };
}

function buildSceneHtml({ repoRoot, sceneHtmlPath, controllers, sceneJsonPath, overrides = {} }) {
  const { html, data } = loadInputs({ repoRoot, sceneHtmlPath, controllers, sceneJsonPath });
  const merged = { ...data, ...overrides };
  return applyReplacements(html, merged, overrides);
}
module.exports = { buildSceneHtml, htmlEscape };
