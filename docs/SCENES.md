# 📐 Scene Definitions

This document defines the **structure** and **schema** for each implemented scene type. Each scene type has:

* A unique JSON schema
* A matching React component
* Strict props and render behavior

All scene data is passed via JSON to ensure compatibility with GPT-driven creation.

---

## ✅ Scene: Hero

**Purpose:** Main splash scene with product name, subtitle, and centered screenshot.

**Schema:** [hero.schema.json](../schemas/hero.schema.json)
**Component:** [Hero.tsx](../src/components/Hero.tsx)

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
* `title`: string (required)
* `subtitle`: string
* `image.src`: URL (required)
* `image.alt`: string

---

## 🗂️ Scene: Notion Dashboard

**Purpose:** Displays a Notion-like dashboard inside a styled browser frame with sections of items.

**Schema:** [notionDashboard.schema.json](../schemas/notionDashboard.schema.json)
**Component:** [NotionDashboard.tsx](../src/components/NotionDashboard.tsx)

**JSON Structure:**

```json
{
  "type": "notionDashboard",
  "mainHeading": "Plan without burnout",
  "subHeading": "This dashboard helps you pace the journey",
  "browserUrl": "https://example.com",
  "dashboardTitle": "My Weekly Planner",
  "sections": [
    {
      "title": "This Week's Focus",
      "emoji": "🔥",
      "items": [
        { "text": "Review project roadmap", "checked": true },
        { "text": "Schedule team check-ins", "checked": false }
      ]
    }
  ]
}
```

**Props:**

* `mainHeading`: string
* `subHeading`: string
* `browserUrl`: URL
* `dashboardTitle`: string
* `sections[]`: array of sections
  * `title`: string
  * `emoji`: string
  * `items[]`: array of items
    * `text`: string
    * `checked`: boolean

---

## Planned Scenes

The following scene types are planned but not yet implemented:

* `sideBySide`
* `quote`
* `gallery`
* `featureList`
* `testimonialGrid`
* `pricingBlock`
* `callToAction`

Each new scene must:

* Have a schema in `schemas/`
* Be registered in the scene loader
* Be documented in this file
