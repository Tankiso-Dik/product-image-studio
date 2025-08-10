# AGENTS — product-image-studio

This file defines the roles and boundaries for AI agents working on this project.
It also encodes the permanent aesthetic principles for the Mondaychick visual style.

---

## 1. **Designer Agent**
**Role:** HTML/CSS visual styling and layout polish.

**Goals:**
- Maintain the premium “glassmorphism + gradient + floating orb” aesthetic.
- Keep styling modular: `base.css`, `theme.css`, `mockup.css`.
- Ensure all backgrounds have emotional weight — gradients, haze, subtle textures.
- Preserve the **signature layout**: floating browser frame with custom header, no device mockups.
- Ensure spacing, proportions, and corner radii match the intended visual language.

**Boundaries:**
- No inline styles — all reusable rules go in shared CSS files.
- No animations or JS.
- Do not introduce third-party mockup assets.

---

## 2. **Renderer Agent**
**Role:** PNG export logic via Puppeteer.

**Goals:**
- Ensure `scripts/render.js` can export 1600×900 PNGs from any scene HTML in `/scenes`.
- Keep rendering consistent across environments.
- Support batch export if required.

**Boundaries:**
- Does not modify CSS or design unless for debug purposes.
- No embedding design logic in rendering scripts.

---

## 3. **Scene Builder Agent**
**Role:** Create new HTML scenes in `/scenes` using shared CSS.

**Goals:**
- Follow naming convention: `NN-scene-name.html`.
- Each scene has a **matching JSON config file** in `/scenes`:
  - Controls **placeholder image paths**, **theme colors**, **headings/subheadings**, and **section/task content**.
  - JSON structure is consistent across all scenes for easy automation.
- Scene HTML must be built with placeholder elements that pull content from its JSON file.
- Scene must include:
  - Floating browser frame with custom tab bar & address bar.
  - `.frame-content` area for screenshots.
  - Optional `.text-overlay` for headings/quotes.
  - Large, soft floating orbs in the background.
- Match the established background vibe: layered gradients + noise overlay.

**Boundaries:**
- No duplication of shared CSS in scenes.
- No alteration of global CSS without Designer Agent sign-off.
- HTML structure stays fixed — only JSON changes to update per-product visuals.

---

## 4. **Prompter (Human)**
**Role:** Oversees and directs all agents.

**Goals:**
- Provide clear scene briefs and visual requirements.
- Approve or reject changes based on adherence to the aesthetic.
- Assign work to specific agents as needed.

**Boundaries:**
- Avoid mixing responsibilities between agents without intention.

---

## Permanent Aesthetic Principles

These apply to **all** scenes, regardless of agent:

1. **Floating Browser Frames** — semi-transparent, soft shadows, rounded corners, custom tab bar, floating above background.
2. **Glassmorphism + Haze** — blur + transparent backgrounds, layered color gradients, subtle noise texture overlay.
3. **Brand Color Themes** — green, yellow, purple, etc., applied via theme classes.
4. **No Device Mockups** — no iPhones, MacBooks, or pre-made devices.
5. **Orbs & Decorative Shapes** — large, low-opacity gradient circles in the corners for depth.
6. **Content as Photography** — screenshots framed intentionally, not “generated” — think like a photographer.
7. **Overlay Text** — headings, captions, or mood quotes can appear above/below frame when needed.
8. **Scene JSON Control** — all dynamic content (images, text, colors) is defined in the scene’s JSON config, not hardcoded into HTML.

