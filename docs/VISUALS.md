# VISUALS.md

This document defines the **visual language and theme system** for the Product Image Studio. These assets influence the look and feel of each scene.

---

## 🎨 Theme Strategy

Themes control the overall color palette, font usage, and background texture for a given scene or set of scenes.

Each theme is defined in JSON like:

```json
{
  "id": "earthy-minimal",
  "font": "Inter",
  "colors": {
    "background": "#f5f0e6",
    "textPrimary": "#2e2b29",
    "accent": "#a67c52"
  },
  "texture": "grunge-light.svg"
}
```

These can be toggled at render time via the scene JSON:

```json
{
  "type": "hero",
  "theme": "earthy-minimal",
  ...
}
```

---

## 🖋 Fonts

All fonts are either:

* Pulled from Google Fonts (with fallback CDN)
* Available locally inside `/assets/fonts`

Suggested fonts:

* Inter (default)
* DM Sans
* Playfair Display (for contrasty scenes)

---

## 🧵 Background Textures

Patterns or grunge overlays are applied as background SVGs, referenced by filename. These live in:

```
/public/assets/textures/
```

Examples:

* `grunge-light.svg`
* `paper-folded.svg`
* `grid-dark.svg`
* `noise-subtle.svg`

Use in scene:

```json
{
  "backgroundTexture": "paper-folded.svg"
}
```

---

## 🧱 Component Styling Philosophy

We use Tailwind for all layout and color classes.
Each component reads from the theme JSON to apply styling dynamically.

Colors, fonts, and even corner radius or padding can vary by theme.

This allows:

* Flexible but consistent mood per scene
* Reuse of core layout components
* Future GPTs to apply visual styling via simple theme IDs

---

## 📁 Directory Layout

```
/public/assets/fonts/
/public/assets/textures/
/src/styles/themes.ts  ← theme registry
```

The `themes.ts` file exports a map of themes that UI components can reference dynamically.

Example:

```ts
export const themes = {
  "earthy-minimal": {
    font: "Inter",
    colors: { ... },
    texture: "grunge-light.svg"
  },
  ...
}
```

---

Let’s lock this as our design guide. Next: want to move on to `EXAMPLES.md` for scene JSONs?
