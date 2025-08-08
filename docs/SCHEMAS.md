# Schemas

This document outlines the JSON schema structure for each scene type supported by the Product Image Studio. Each schema ensures strict typing, required fields, and validation logic to keep the rendering predictable and GPT-friendly.

---

## Global Notes

* All scene JSON files must follow a strict schema.
* Validation is done via AJV before rendering.
* Each scene has a `type` field as the top-level discriminator.
* Fields not included in the schema will be ignored during rendering.

---

## hero.schema.json

```json
{
  "type": "object",
  "required": ["type", "title", "subtitle", "image"],
  "properties": {
    "type": { "const": "hero" },
    "backgroundColor": { "type": "string", "format": "color" },
    "title": { "type": "string" },
    "subtitle": { "type": "string" },
    "image": {
      "type": "object",
      "required": ["src"],
      "properties": {
        "src": { "type": "string", "format": "uri" },
        "alt": { "type": "string" }
      }
    },
    "textAlign": {
      "type": "string",
      "enum": ["left", "center", "right"],
      "default": "center"
    },
    "fontFamily": { "type": "string" },
    "fontSize": { "type": "number" },
    "pattern": { "type": "string" },
    "textColor": { "type": "string", "format": "color" }
  },
  "additionalProperties": false
}
```

---

## featureGrid.schema.json

*(Planned)*

```json
{
  "type": "object",
  "required": ["type", "title", "features"],
  "properties": {
    "type": { "const": "featureGrid" },
    "title": { "type": "string" },
    "features": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["title", "description"],
        "properties": {
          "title": { "type": "string" },
          "description": { "type": "string" },
          "icon": { "type": "string", "format": "uri" }
        }
      }
    },
    "columns": { "type": "integer", "default": 2 },
    "backgroundColor": { "type": "string", "format": "color" },
    "pattern": { "type": "string" }
  },
  "additionalProperties": false
}
```

---

## callout.schema.json

*(Planned)*

```json
{
  "type": "object",
  "required": ["type", "text"],
  "properties": {
    "type": { "const": "callout" },
    "text": { "type": "string" },
    "icon": { "type": "string" },
    "color": { "type": "string", "format": "color" },
    "textColor": { "type": "string", "format": "color" },
    "pattern": { "type": "string" },
    "fontSize": { "type": "number" }
  },
  "additionalProperties": false
}
```

---

Additional schemas will follow the same rules: strongly typed, no extraneous properties, and custom visual configuration support (font, color, pattern, etc.).
