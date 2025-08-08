# Examples

This document contains real, minimal, and complete example JSON configurations for each available scene type. These examples are used to:

* Verify JSON schema and validator behavior
* Guide GPTs in generating scene data
* Help users understand the expected structure

---

## Hero Scene

```json
{
  "type": "hero",
  "backgroundColor": "#fef9f4",
  "title": "Welcome to Product Image Studio",
  "subtitle": "Your personal visual engine",
  "image": {
    "src": "https://placehold.co/800x400?text=Mock+Screenshot",
    "alt": "Example template screenshot"
  }
}
```

---

## Notion Dashboard Scene

```json
{
  "type": "notionDashboard",
  "mainHeading": "Plan without burnout",
  "subHeading": "This dashboard helps you pace the journey",
  "browserUrl": "mondaychick.co",
  "dashboardTitle": "My Weekly Planner",
  "sections": [
    {
      "title": "This Week's Focus",
      "emoji": "",
      "items": [
        { "text": "Review project roadmap", "checked": true },
        { "text": "Schedule team check-ins", "checked": false },
        { "text": "Prepare presentation slides", "checked": false }
      ]
    },
    {
      "title": "Energy Management",
      "emoji": "",
      "items": [
        { "text": "Morning meditation (15 min)", "checked": true },
        { "text": "Take lunch break away from desk", "checked": false }
      ]
    }
  ]
}
```

---

Each of these examples maps directly to a schema file inside `/schemas/` and a component inside `/src/components/`. They can be validated with Ajv and used in prompt recipes.
