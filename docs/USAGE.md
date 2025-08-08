# Usage

## Local Development
```bash
npm install
npm run dev
```
Visit http://localhost:5173 to view the demo.

## Generating a Scene with GPT
1. Ask GPT to produce a scene JSON and matching schema following the examples in `/schemas/`.
2. Save the schema under `schemas/` and the data file under `public/sceneData/`.
3. Create a React component in `src/components/` that consumes the scene data.
4. Validate all scenes:
```bash
npm run lint
# (optional) npm run validate   # if a validation script is added
```

## Production Build
```bash
npm run build
npm run preview
```
