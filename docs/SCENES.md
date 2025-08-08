# 📐 Scene Definitions

This document defines the **structure** and **schema** for each planned scene type. Each scene type has:

* A unique JSON schema
* A matching React component
* Strict props and render behavior

All scene data is passed via JSON to ensure compatibility with GPT-driven creation.

---

## ✅ Scene: Hero

**Purpose:** Main splash scene with product name, subtitle, and centered screenshot.

**JSON Structure:**

```json
{
  "type": "hero",
  "backgroundColor": "#f0f9f4",
  "title": "Product Name",
  "subtitle": "Your subtitle here",
  "image": {
    "src": "https://...",
    "alt": "..."
  }
}
```

**Props:**

* `backgroundColor`: Hex color string
* `title`: string
* `subtitle`: string
* `image.src`: URL
* `image.alt`: string

---

## 🪞 Scene: SideBySide

**Purpose:** Two-column layout with text on one side and image on the other.

**JSON Structure:**

```json
{
  "type": "sideBySide",
  "backgroundColor": "#fff",
  "leftText": "...",
  "rightImage": {
    "src": "...",
    "alt": "..."
  },
  "reverse": false
}
```

**Props:**

* `leftText`: Markdown allowed
* `rightImage.src`
* `rightImage.alt`
* `reverse`: if true, flips image/text

---

## 💬 Scene: Quote

**Purpose:** Stylish callout with large quote text and attribution

**JSON Structure:**

```json
{
  "type": "quote",
  "quote": "Design is the silent ambassador of your brand.",
  "author": "Paul Rand",
  "backgroundPattern": "grunge-01.svg"
}
```

**Props:**

* `quote`: large stylized text
* `author`: caption
* `backgroundPattern`: local asset name (SVG)

---

## 🖼️ Scene: Gallery

**Purpose:** Grid of 3–6 mockups, each with optional label

**JSON Structure:**

```json
{
  "type": "gallery",
  "images": [
    { "src": "...", "alt": "...", "caption": "..." },
    ...
  ]
}
```

**Props:**

* `images[]`: must be between 3–6 items
* `caption`: optional

---

## 🧠 Scene: FeatureList

**Purpose:** Bullet-style benefits list with checkmarks or icons

**JSON Structure:**

```json
{
  "type": "featureList",
  "title": "Why you'll love it",
  "features": ["Fast", "Minimal setup", "Beautiful visuals"],
  "iconStyle": "check" // or "star", "bolt"
}
```

**Props:**

* `title`: string
* `features[]`: list of strings
* `iconStyle`: preset

---

## Coming Soon

* `testimonialGrid`
* `pricingBlock`
* `callToAction`

Each new scene must:

* Have a schema in `schemas/`
* Be registered in scene loader
* Be documented in this file
