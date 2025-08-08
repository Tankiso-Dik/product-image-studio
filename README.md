# Product Image Studio

A data‑driven layout engine for generating marketing and product mockups from JSON scene files.

## Tech Stack
- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Ajv for JSON Schema validation

## Project Structure
```
public/          static assets and `sceneData` JSON files
schemas/         JSON Schemas for scenes
src/             React components and application code
└── components/  Scene-specific components
```
Additional reference docs live under `docs/`:
- [SCENES.md](docs/SCENES.md) – schema/component specs
- [THEMES.md](docs/THEMES.md) – theme assets and tokens
- [EXAMPLES.md](docs/EXAMPLES.md) – sample `sceneData` files
- [USAGE.md](docs/USAGE.md) – manual & GPT workflow

## Planned Scenes
- Hero banner
- Notion-style dashboard
- Upcoming layouts like calendars, kanban boards, and more

## Style Direction
Light radial gradients, soft shadows, subtle noise textures, and floating orbs evoke a calm productivity vibe. Inter is the primary typeface and Tailwind tokens drive spacing and color.

## JSON Format Philosophy
Each scene is defined by a JSON file in `public/sceneData/` and validated against a schema in `/schemas/`. Components read typed data, enabling predictable rendering and AI-assisted generation.

## Scripts
```bash
npm install    # install dependencies
npm run dev    # start dev server
npm run build  # build for production
npm run lint   # run ESLint
```
