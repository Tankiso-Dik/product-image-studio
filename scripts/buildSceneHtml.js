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

function buildSceneHtml({ repoRoot, sceneHtmlPath, controllers, sceneJsonPath, overrides = {} }) {
  // Two modes supported for compatibility:
  // - Legacy: { repoRoot, sceneHtmlPath, controllers }
  // - New:    { sceneJsonPath }
  if (sceneJsonPath) {
    const jsonAbs = path.resolve(sceneJsonPath);
    const sceneDir = path.dirname(jsonAbs);
    const base = path.basename(jsonAbs).replace(/\.json$/, '');
    const htmlPath = path.join(sceneDir, `${base}.html`);

    const data = { ...JSON.parse(fs.readFileSync(jsonAbs, 'utf-8')), ...overrides };
    let html = fs.readFileSync(htmlPath, 'utf-8');

    // addressBar
    html = html.replace(
      /(<input[^>]*data-key="addressBar"[^>]*value=")[^"]*(")/,
      (_, a, b) => `${a}${htmlEscape(data.addressBar || '')}${b}`
    );

    // main/sub headings
    html = html
      .replace(
        /(<h1[^>]*data-key="mainHeading"[^>]*>)([\s\S]*?)(<\/h1>)/,
        (_, a, _b, c) => `${a}${htmlEscape(data.mainHeading || '')}${c}`
      )
      .replace(
        /(<p[^>]*data-key="subHeading"[^>]*>)([\s\S]*?)(<\/p>)/,
        (_, a, _b, c) => `${a}${htmlEscape(data.subHeading || '')}${c}`
      );

    // screenshot src (allow remote/data URLs or relative path)
    const imgSrc = data.browserScreenshot || '../assets/screenshots/placeholder.png';
    // Support single-screenshot scenes
    html = html.replace(
      /(<img[^>]*class="browser-screenshot"(?![^>]*\bleft\b)(?![^>]*\bright\b)[^>]*src=")[^"]*(")/,
      (_, a, b) => `${a}${imgSrc}${b}`
    );
    // Support two-up scenes
    if (data.browserScreenshotLeft) {
      html = html.replace(
        /(<img[^>]*data-key="browserScreenshotLeft"[^>]*src=")[^"]*(")/,
        (_, a, b) => `${a}${data.browserScreenshotLeft}${b}`
      );
      if (!/data-has-screenshot-left=/.test(html) && !/placeholder\.png/.test(String(data.browserScreenshotLeft))) {
        html = html.replace('<body', '<body data-has-screenshot-left="true"');
      }
    }
    if (data.browserScreenshotRight) {
      html = html.replace(
        /(<img[^>]*data-key="browserScreenshotRight"[^>]*src=")[^"]*(")/,
        (_, a, b) => `${a}${data.browserScreenshotRight}${b}`
      );
      if (!/data-has-screenshot-right=/.test(html) && !/placeholder\.png/.test(String(data.browserScreenshotRight))) {
        html = html.replace('<body', '<body data-has-screenshot-right="true"');
      }
    }
    // Support how-to scenes with up to four screenshots and labels
    for (let i = 1; i <= 4; i++) {
      const key = `browserScreenshot${i}`;
      if (data[key]) {
        const re = new RegExp(`(<img[^>]*data-key=\"${key}\"[^>]*src=\")[^\"]*(\")`);
        html = html.replace(re, (_, a, b) => `${a}${data[key]}${b}`);
        const flag = `data-has-screenshot-${i}`;
        if (!new RegExp(flag).test(html) && !/placeholder\.png/.test(String(data[key]))) {
          html = html.replace('<body', `<body ${flag}="true"`);
        }
      }
      const labelKey = `stepLabel${i}`;
      if (data[labelKey]) {
        const labelRe = new RegExp(`(<[^>]*data-key=\"${labelKey}\"[^>]*>)([\s\S]*?)(<\/[^>]+>)`);
        html = html.replace(labelRe, (_, a, _b, c) => `${a}${htmlEscape(data[labelKey])}${c}`);
      }
      const textKey = `stepText${i}`;
      if (data[textKey]) {
        const textRe = new RegExp(`(<[^>]*data-key=\"${textKey}\"[^>]*>)([\s\S]*?)(<\/[^>]+>)`);
        html = html.replace(textRe, (_, a, _b, c) => `${a}${htmlEscape(data[textKey])}${c}`);
      }
    }
    // Toggle single screenshot visibility flag on <body> when not using placeholder
    if (!/data-has-screenshot=/.test(html)) {
      const isPlaceholder = /placeholder\.png(?:$|\?|#)/.test(String(imgSrc));
      if (!isPlaceholder && !data.browserScreenshotLeft && !data.browserScreenshotRight) {
        html = html.replace('<body', '<body data-has-screenshot="true"');
      }
    }

    // theme (hook CSS with [data-theme="..."])
    if (data.theme) html = html.replace('<body', `<body data-theme="${htmlEscape(data.theme)}"`);

    // sections
    const sectionsHtml = (data.sections || []).map((sec) => renderSection(sec)).join('\n');
    html = html.replace(
      /(<div[^>]*data-key="sections"[^>]*>)([\s\S]*?)(<\/div>)/,
      (_, a, _b, c) => `${a}\n${sectionsHtml}\n${c}`
    );

    // Ensure a base href so relative assets resolve when opened via blob URLs
    if (!/<base\s+href=/i.test(html)) {
      html = html.replace(/<head(\s[^>]*)?>/i, (m) => `${m}<base href="/">`);
    }
    return html;
  }

  // Legacy compatibility path: use existing loader's algorithm
  const repo = repoRoot || process.cwd();
  const sceneAbs = path.resolve(repo, sceneHtmlPath);
  const sceneDir = path.dirname(sceneAbs);
  let html = fs.readFileSync(sceneAbs, 'utf-8');
  const data = { ...(controllers || {}) };

  // addressBar
  if (Object.prototype.hasOwnProperty.call(data, 'addressBar')) {
    html = html.replace(
      /(<input[^>]*data-key="addressBar"[^>]*value=")[^"]*(")/,
      (_, a, b) => `${a}${htmlEscape(data.addressBar || '')}${b}`
    );
  }
  // headings
  if (Object.prototype.hasOwnProperty.call(data, 'mainHeading')) {
    html = html.replace(
      /(<h1[^>]*data-key="mainHeading"[^>]*>)([\s\S]*?)(<\/h1>)/,
      (_, a, _b, c) => `${a}${htmlEscape(data.mainHeading || '')}${c}`
    );
  }
  if (Object.prototype.hasOwnProperty.call(data, 'subHeading')) {
    html = html.replace(
      /(<p[^>]*data-key="subHeading"[^>]*>)([\s\S]*?)(<\/p>)/,
      (_, a, _b, c) => `${a}${htmlEscape(data.subHeading || '')}${c}`
    );
  }
  // brand icon
  if (Object.prototype.hasOwnProperty.call(data, 'brandIcon')) {
    html = html.replace(
      /(<img[^>]*data-key="brandIcon"[^>]*src=")[^"]*(")/,
      (_, a, b) => `${a}${data.brandIcon}${b}`
    );
  }
  // screenshot (legacy single)
  if (Object.prototype.hasOwnProperty.call(data, 'browserScreenshot')) {
    html = html.replace(
      /(<img[^>]*class="browser-screenshot"(?![^>]*\bleft\b)(?![^>]*\bright\b)[^>]*src=")[^"]*(")/,
      (_, a, b) => `${a}${data.browserScreenshot}${b}`
    );
    if (!/data-has-screenshot=/.test(html)) {
      const isPlaceholder = /placeholder\.png(?:$|\?|#)/.test(String(data.browserScreenshot));
      if (!isPlaceholder) {
        html = html.replace('<body', '<body data-has-screenshot="true"');
      }
    }
  }
  // two-up legacy keys
  if (Object.prototype.hasOwnProperty.call(data, 'browserScreenshotLeft')) {
    html = html.replace(
      /(<img[^>]*data-key="browserScreenshotLeft"[^>]*src=")[^"]*(")/,
      (_, a, b) => `${a}${data.browserScreenshotLeft}${b}`
    );
    if (!/data-has-screenshot-left=/.test(html)) {
      const isPlaceholder = /placeholder\.png(?:$|\?|#)/.test(String(data.browserScreenshotLeft));
      if (!isPlaceholder) {
        html = html.replace('<body', '<body data-has-screenshot-left="true"');
      }
    }
  }
  if (Object.prototype.hasOwnProperty.call(data, 'browserScreenshotRight')) {
    html = html.replace(
      /(<img[^>]*data-key="browserScreenshotRight"[^>]*src=")[^"]*(")/,
      (_, a, b) => `${a}${data.browserScreenshotRight}${b}`
    );
    if (!/data-has-screenshot-right=/.test(html)) {
      const isPlaceholder = /placeholder\.png(?:$|\?|#)/.test(String(data.browserScreenshotRight));
      if (!isPlaceholder) {
        html = html.replace('<body', '<body data-has-screenshot-right="true"');
      }
    }
  }
  // theme
  if (Object.prototype.hasOwnProperty.call(data, 'theme')) {
    html = html.replace('<body', `<body data-theme="${htmlEscape(data.theme)}"`);
  }
  // sections
  if (Array.isArray(data.sections)) {
    const sectionsHtml = data.sections.map((sec) => renderSection(sec)).join('\n');
    html = html.replace(
      /(<div[^>]*data-key="sections"[^>]*>)([\s\S]*?)(<\/div>)/,
      (_, a, _b, c) => `${a}\n${sectionsHtml}\n${c}`
    );
  }
  // how-to legacy: screenshots 1..4 and labels
  for (let i = 1; i <= 4; i++) {
    const key = `browserScreenshot${i}`;
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const re = new RegExp(`(<img[^>]*data-key=\"${key}\"[^>]*src=\")[^\"]*(\")`);
      html = html.replace(re, (_, a, b) => `${a}${data[key]}${b}`);
      const flag = `data-has-screenshot-${i}`;
      const isPlaceholder = /placeholder\.png(?:$|\?|#)/.test(String(data[key]));
      if (!new RegExp(flag).test(html) && !isPlaceholder) {
        html = html.replace('<body', `<body ${flag}="true"`);
      }
    }
    const labelKey = `stepLabel${i}`;
    if (Object.prototype.hasOwnProperty.call(data, labelKey)) {
      const labelRe = new RegExp(`(<[^>]*data-key=\"${labelKey}\"[^>]*>)([\s\S]*?)(<\/[^>]+>)`);
      html = html.replace(labelRe, (_, a, _b, c) => `${a}${htmlEscape(data[labelKey])}${c}`);
    }
    const textKey = `stepText${i}`;
    if (Object.prototype.hasOwnProperty.call(data, textKey)) {
      const textRe = new RegExp(`(<[^>]*data-key=\"${textKey}\"[^>]*>)([\s\S]*?)(<\/[^>]+>)`);
      html = html.replace(textRe, (_, a, _b, c) => `${a}${htmlEscape(data[textKey])}${c}`);
    }
  }

  // Ensure a base href so relative assets resolve when opened via blob URLs
  if (!/<base\s+href=/i.test(html)) {
    html = html.replace(/<head(\s[^>]*)?>/i, (m) => `${m}<base href="/">`);
  }
  return html;
}

module.exports = { buildSceneHtml };
