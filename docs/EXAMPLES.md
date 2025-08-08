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
  "backgroundColor": "#f0f9f4",
  "title": "Your Goals, Visualized",
  "subtitle": "Notion templates to help you win the day.",
  "image": {
    "src": "https://example.com/image.png",
    "alt": "Mockup of dashboard"
  }
}
```

---

## Feature Grid Scene

```json
{
  "type": "featureGrid",
  "backgroundColor": "#ffffff",
  "title": "Everything You Need",
  "features": [
    {
      "icon": "check-circle",
      "title": "Goal Tracker",
      "description": "Stay on top of your short- and long-term goals."
    },
    {
      "icon": "calendar",
      "title": "Habit Logs",
      "description": "Track your daily routines with ease."
    }
  ]
}
```

---

## Testimonial Scene

```json
{
  "type": "testimonial",
  "backgroundColor": "#fef7f0",
  "quote": "This template changed how I plan my entire week!",
  "author": "Lynn R.",
  "role": "Notion Seller",
  "avatar": "https://example.com/avatar.png"
}
```

---

## Split Layout Scene

```json
{
  "type": "splitLayout",
  "backgroundColor": "#f9f9f9",
  "title": "Plan. Review. Repeat.",
  "text": "Each page in this template is designed with intention.",
  "image": {
    "src": "https://example.com/side-by-side.png",
    "alt": "Side-by-side of template sections"
  },
  "reverse": false
}
```

---

## Image Showcase Scene

```json
{
  "type": "imageShowcase",
  "backgroundColor": "#ffffff",
  "title": "Visual Walkthrough",
  "images": [
    {
      "src": "https://example.com/ss1.png",
      "alt": "First dashboard page"
    },
    {
      "src": "https://example.com/ss2.png",
      "alt": "Second dashboard page"
    }
  ]
}
```

---

Each of these examples maps directly to a schema file inside `/schemas/` and a component inside `/src/components/`. They can be validated with Ajv and used in prompt recipes.
