Alright — here’s your **`SCENE_SCHEMA.md`** so any AI (or you in the future) knows exactly how scene JSON should be structured.

---

**`SCENE_SCHEMA.md`**

````markdown
# Scene JSON Schema — product-image-studio

Each scene in `/scenes` has **two files**:
- `NN-scene-name.html` — HTML layout with placeholders.
- `NN-scene-name.json` — JSON configuration that controls all dynamic content.

The JSON drives what appears in the HTML via `data-key` attributes.
This allows updating content without editing HTML directly.

---

## JSON Structure

```json
{
  "theme": "green",
  "addressBar": "mondaychick.co",
  "browserScreenshot": "../assets/screenshots/dashboard.png",
  "mainHeading": "Plan without burnout",
  "subHeading": "This dashboard helps you pace the journey",
  "sections": [
    {
      "emoji": "🎯",
      "title": "Focus Areas",
      "tasks": [
        { "text": "Define project scope & milestones", "completed": true },
        { "text": "Schedule stakeholder reviews", "completed": true },
        { "text": "Prepare quarterly presentation", "completed": false }
      ],
      "progress": 65
    },
    {
      "emoji": "⚡",
      "title": "Energy Management",
      "tasks": [
        { "text": "Morning mindfulness routine", "completed": true },
        { "text": "Take proper lunch breaks", "completed": false },
        { "text": "Evening wind-down ritual", "completed": false }
      ]
    }
  ]
}
````

---

## Field Descriptions

| Key                                | Type      | Description                                                                        |
| ---------------------------------- | --------- | ---------------------------------------------------------------------------------- |
| **theme**                          | `string`  | Visual theme class applied to the scene (e.g., `"green"`, `"yellow"`, `"purple"`). |
| **addressBar**                     | `string`  | Text displayed in the mockup’s address bar.                                        |
| **browserScreenshot**              | `string`  | Relative path to screenshot image inside `/assets/screenshots/`.                   |
| **mainHeading**                    | `string`  | Large heading below the browser mockup.                                            |
| **subHeading**                     | `string`  | Supporting subheading below the main heading.                                      |
| **sections**                       | `array`   | Array of section objects for the dashboard content.                                |
| **sections\[].emoji**              | `string`  | Emoji displayed in section header.                                                 |
| **sections\[].title**              | `string`  | Section title.                                                                     |
| **sections\[].tasks**              | `array`   | Array of task objects.                                                             |
| **sections\[].tasks\[].text**      | `string`  | Task description.                                                                  |
| **sections\[].tasks\[].completed** | `boolean` | Whether task checkbox is marked as complete.                                       |
| **sections\[].progress**           | `number`  | (Optional) Progress bar fill percentage for this section (0–100).                  |

---

## HTML Placeholder Mapping

Elements in `NN-scene-name.html` must have `data-key` attributes matching JSON keys.

Examples:

```html
<input type="text" class="address-bar" data-key="addressBar">
<img class="browser-screenshot" data-key="browserScreenshot" src="../assets/screenshots/placeholder.png">
<h1 class="main-heading" data-key="mainHeading"></h1>
<p class="sub-heading" data-key="subHeading"></p>
<div class="dashboard-sections" data-key="sections"></div>
```

The `sections` array will require special rendering logic in the loader script to generate multiple `.dashboard-section` blocks.

---

## Rules

1. All content changes happen in JSON, never directly in HTML.
2. HTML files should render with dummy placeholder values if JSON is not yet injected.
3. JSON paths for images are **relative to the scene HTML**.
4. The schema must remain consistent across all scenes for automation.

```

---

Do you want me to also prep the **first loader script** so it can take this JSON and inject it into your HTML before Puppeteer exports the PNG? That would fully connect the system.
```
