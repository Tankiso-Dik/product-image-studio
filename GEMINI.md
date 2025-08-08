# GEMINI.md

This file outlines how to work with **Gemini CLI** to generate, scaffold, and validate scenes, schemas, and assets for the Product Image Studio React application.

---

##  Core Concepts

### 1. Scene Data
Scene data is stored in local JSON files in the `/public/sceneData/` directory. Each file represents a single scene to render, validated against a corresponding schema in `/schemas/`.

### 2. Component Structure
React components live in `/src/components/`. All scenes map to one or more visual components. Components should be styled using TailwindCSS, with occasional CSS module overrides.

### 3. Asset Bundling
Patterns, textures, and SVG themes are stored in `/public/assets/`. Each scene can declare visual assets by referencing these.

---

##  Gemini CLI Prompts

### ➕ Generate a New Scene + Schema
```prompt
Generate a JSON scene file and matching JSON schema for a React component that renders a marketing banner. The schema should validate backgroundColor, title, subtitle, and an image object with src and alt. Include mock values for the scene file.
```

###  Add Pattern Suggestions
```prompt
List 10 aesthetic background patterns or textures that would suit a modern productivity dashboard. Give them names, visual descriptions, and ideal use cases.
```

###  Scaffold a Component
```prompt
Create a React functional component in TypeScript that receives a scene prop matching the hero.schema.json format and renders a styled section using TailwindCSS. Include validation fallback.
```

###  Suggest Folder Names
```prompt
What’s a good folder and file naming convention for a system that contains JSON scene data, JSON schemas, reusable background patterns, and rendered screenshots?
```

---

## ️ CLI Commands

```bash
npm install
npm run dev     # Start React dev server on http://localhost:5173
npm run validate # Run Ajv validation on all sceneData/*.json
```

##  Folder Layout
```
product-image-studio/
├── public/
│   ├── sceneData/
│   └── assets/
├── schemas/
├── src/
│   ├── components/
│   └── main.tsx
├── GEMINI.md
├── README.md
```

## ✅ Validation
Use `Ajv` to validate each scene JSON against its matching schema before rendering.

---

##  Recommended Prompts
- Generate SVG assets for background overlays
- Propose font pairings for modern landing pages
- Scaffold a form-based UI for live scene editing
- Refactor a scene layout to be mobile responsive

---

##  Constraints
- No CDN dependencies
- All assets and schemas must resolve locally
- Scene loading must degrade gracefully if a file is malformed

---

Use this file as a Gemini CLI prompt reference and quality checklist while building out new templates and scenes.