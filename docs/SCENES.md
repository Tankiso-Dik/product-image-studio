# Scene Specifications

This project renders marketing scenes from JSON files. Each scene uses a JSON Schema for validation and a dedicated React component.

## Hero
- **Schema**: `schemas/hero.schema.json`
- **Component**: `src/components/Hero.tsx`
- **Purpose**: Landing page hero with headline, subtitle, and screenshot.
- **Fields**:
  - `type` (must be `"hero"`)
  - `title`
  - `subtitle`
  - `backgroundColor`
  - `image` object with `src` and `alt`
- **Example**: `public/sceneData/hero.json`

## Notion Dashboard
- **Schema**: `schemas/notionDashboard.schema.json`
- **Component**: `src/components/NotionDashboard.tsx`
- **Purpose**: Notion-style task board inside a browser mockup.
- **Fields**:
  - `type` (must be `"notionDashboard"`)
  - `mainHeading`, `subHeading`
  - `browserUrl`, `dashboardTitle`
  - `sections[]` → `{ title, emoji, items[] }`
  - `items[]` → `{ text, checked }`
- **Example**: `public/sceneData/notionDashboard.json`

## Planned Scenes
Additional layouts like calendars, kanban boards, and code snippets will be added as new schemas and components.
